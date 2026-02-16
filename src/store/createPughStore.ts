import { createStore, type StateCreator } from 'zustand/vanilla';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { Criterion, Tool, ScoreEntry } from '../types';
import type { Persister } from '../persist/types';
import type { PughStore, PughDomainState } from './types';
import type { PughEvent, Branch } from '../events/types';
import { projectEvents } from '../events/projection';
import { seedEventsFromOptions } from '../events/seedFromLegacy';

export interface CreatePughStoreOptions {
  criteria?: Criterion[];
  tools?: Tool[];
  scores?: ScoreEntry[];
  weights?: Record<string, number>;
  persistKey?: string;
  persister?: Persister;
}

function createPughStorageAdapter(persister: Persister) {
  return createJSONStorage<PughStore>(() => ({
    getItem: (key: string) => persister.load(key),
    setItem: (key: string, value: string) => persister.save(key, value),
    removeItem: (key: string) => persister.remove(key),
  }));
}

function makeEvent(type: PughEvent['type'], payload: Record<string, unknown>): PughEvent {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    user: 'anonymous',
    type,
    ...payload,
  } as PughEvent;
}

function getActiveBranch(branches: Branch[], activeBranchId: string): Branch {
  return branches.find((b) => b.id === activeBranchId)!;
}

export function createPughStore(options: CreatePughStoreOptions = {}) {
  const {
    criteria = [],
    tools = [],
    scores = [],
    weights = {},
    persistKey = 'pugh-matrix',
    persister,
  } = options;

  const initialEvents = seedEventsFromOptions({ criteria, tools, scores, weights });
  const initialDomain = projectEvents(initialEvents);
  const mainBranch: Branch = {
    id: 'main',
    name: 'main',
    events: initialEvents,
    createdAt: Date.now(),
  };

  const storeCreator: StateCreator<PughStore> = (set, get) => ({
    // Domain state (projected from events)
    ...initialDomain,

    // Event store state
    branches: [mainBranch],
    activeBranchId: 'main',

    // Event store actions
    dispatch: (event: PughEvent) => {
      const state = get();
      const branches = state.branches.map((b) =>
        b.id === state.activeBranchId
          ? { ...b, events: [...b.events, event] }
          : b,
      );
      const activeBranch = getActiveBranch(branches, state.activeBranchId);
      const domain = projectEvents(activeBranch.events);
      set({ branches, ...domain });
    },

    createBranch: (name: string) => {
      const state = get();
      const parentBranch = getActiveBranch(state.branches, state.activeBranchId);
      const newBranch: Branch = {
        id: `branch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        events: [...parentBranch.events],
        createdAt: Date.now(),
        parentBranchId: parentBranch.id,
        forkEventIndex: parentBranch.events.length,
      };
      set({
        branches: [...state.branches, newBranch],
        activeBranchId: newBranch.id,
      });
    },

    switchBranch: (branchId: string) => {
      const state = get();
      const branch = state.branches.find((b) => b.id === branchId);
      if (!branch) return;
      const domain = projectEvents(branch.events);
      set({ activeBranchId: branchId, ...domain });
    },

    renameBranch: (branchId: string, name: string) => {
      const state = get();
      set({
        branches: state.branches.map((b) =>
          b.id === branchId ? { ...b, name } : b,
        ),
      });
    },

    deleteBranch: (branchId: string) => {
      const state = get();
      if (branchId === 'main') return;
      const remaining = state.branches.filter((b) => b.id !== branchId);
      if (state.activeBranchId === branchId) {
        const domain = projectEvents(remaining[0].events);
        set({ branches: remaining, activeBranchId: remaining[0].id, ...domain });
      } else {
        set({ branches: remaining });
      }
    },

    // UI state
    showTotals: false,
    showWeights: false,
    editingCell: null,
    editScore: '',
    editLabel: '',
    editComment: '',
    editingHeader: null,
    editHeaderValue: '',

    // Domain actions (thin wrappers around dispatch)
    addScore: (entry: ScoreEntry) => {
      get().dispatch(
        makeEvent('ScoreSet', {
          toolId: entry.toolId,
          criterionId: entry.criterionId,
          score: entry.score,
          label: entry.label,
          comment: entry.comment,
          user: entry.user,
        }),
      );
    },

    setWeight: (criterionId: string, weight: number) => {
      get().dispatch(makeEvent('WeightSet', { criterionId, weight }));
    },

    addTool: (id: string, label: string, user: string) => {
      get().dispatch(makeEvent('ToolAdded', { toolId: id, label, user }));
    },

    removeTool: (id: string) => {
      get().dispatch(makeEvent('ToolRemoved', { toolId: id }));
    },

    addCriterion: (id: string, label: string) => {
      get().dispatch(makeEvent('CriterionAdded', { criterionId: id, label }));
    },

    removeCriterion: (id: string) => {
      get().dispatch(makeEvent('CriterionRemoved', { criterionId: id }));
    },

    renameTool: (id: string, newLabel: string) => {
      get().dispatch(makeEvent('ToolRenamed', { toolId: id, newLabel }));
    },

    renameCriterion: (id: string, newLabel: string) => {
      get().dispatch(makeEvent('CriterionRenamed', { criterionId: id, newLabel }));
    },

    // UI actions
    setShowTotals: (show: boolean) => set(() => ({ showTotals: show })),
    toggleTotals: () => set((state) => ({ showTotals: !state.showTotals })),
    setShowWeights: (show: boolean) => set(() => ({ showWeights: show })),
    toggleWeights: () => set((state) => ({ showWeights: !state.showWeights })),
    startEditing: (toolId: string, criterionId: string) =>
      set(() => ({
        editingCell: { toolId, criterionId },
        editScore: '',
        editLabel: '',
        editComment: '',
      })),
    cancelEditing: () => set(() => ({ editingCell: null })),
    setEditScore: (editScore: string) => set(() => ({ editScore })),
    setEditLabel: (editLabel: string) => set(() => ({ editLabel })),
    setEditComment: (editComment: string) => set(() => ({ editComment })),
    startEditingHeader: (type: 'tool' | 'criterion', id: string) =>
      set((state) => {
        const items = type === 'tool' ? state.tools : state.criteria;
        const item = items.find((i) => i.id === id);
        return {
          editingHeader: { type, id },
          editHeaderValue: item?.label ?? '',
        };
      }),
    cancelEditingHeader: () => set(() => ({ editingHeader: null, editHeaderValue: '' })),
    setEditHeaderValue: (editHeaderValue: string) => set(() => ({ editHeaderValue })),
    saveHeaderEdit: () => {
      const state = get();
      if (!state.editingHeader) return;
      const trimmed = state.editHeaderValue.trim();
      if (!trimmed) return;
      const { type, id } = state.editingHeader;
      if (type === 'tool') {
        state.dispatch(makeEvent('ToolRenamed', { toolId: id, newLabel: trimmed }));
      } else {
        state.dispatch(makeEvent('CriterionRenamed', { criterionId: id, newLabel: trimmed }));
      }
      set({ editingHeader: null, editHeaderValue: '' });
    },
  });

  if (!persister) {
    return createStore<PughStore>()(
      devtools(storeCreator, { name: `PughMatrix` }),
    );
  }

  const store = createStore<PughStore>()(
    devtools(
      persist(storeCreator, {
        name: persistKey,
        version: 2,
        storage: createPughStorageAdapter(persister),
        partialize: (state) =>
          ({
            branches: state.branches,
            activeBranchId: state.activeBranchId,
          }) as unknown as PughStore,
        merge: (persisted, current) => {
          const merged = { ...current, ...(persisted as Partial<PughStore>) };
          if (merged.branches && merged.activeBranchId) {
            const branch = getActiveBranch(merged.branches, merged.activeBranchId);
            if (branch) {
              const domain = projectEvents(branch.events);
              return { ...merged, ...domain };
            }
          }
          return merged;
        },
      }),
      { name: `PughMatrix(${persistKey})` },
    ),
  );

  if (persister.subscribe) {
    persister.subscribe(persistKey, () => {
      (store as unknown as { persist: { rehydrate: () => void } }).persist.rehydrate();
    });
  }

  return store;
}

export type PughStoreInstance = ReturnType<typeof createPughStore>;
