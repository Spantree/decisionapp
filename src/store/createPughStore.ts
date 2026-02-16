import { createStore } from 'zustand/vanilla';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { Criterion, Tool, ScoreEntry } from '../types';
import type { Persister } from '../persist/types';
import type { PughStore, PughDomainState } from './types';

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

export function createPughStore(options: CreatePughStoreOptions = {}) {
  const {
    criteria = [],
    tools = [],
    scores = [],
    weights = {},
    persistKey = 'pugh-matrix',
    persister,
  } = options;

  const initialWeights: Record<string, number> = { ...weights };
  for (const c of criteria) {
    if (!(c.id in initialWeights)) {
      initialWeights[c.id] = 10;
    }
  }

  const storeCreator = (
    set: (fn: (state: PughStore) => Partial<PughStore>) => void,
  ): PughStore => ({
    criteria,
    tools,
    scores,
    weights: initialWeights,
    showTotals: false,
    editingCell: null,
    editScore: '',
    editLabel: '',
    editComment: '',
    setCriteria: (criteria: Criterion[]) => set(() => ({ criteria })),
    setTools: (tools: Tool[]) => set(() => ({ tools })),
    addScore: (entry: ScoreEntry) =>
      set((state) => ({ scores: [...state.scores, entry] })),
    setWeight: (criterionId: string, weight: number) =>
      set((state) => ({
        weights: { ...state.weights, [criterionId]: weight },
      })),
    setShowTotals: (show: boolean) => set(() => ({ showTotals: show })),
    toggleTotals: () => set((state) => ({ showTotals: !state.showTotals })),
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
    renameTool: (id: string, newLabel: string) =>
      set((state) => ({
        tools: state.tools.map((t) =>
          t.id === id ? { ...t, label: newLabel } : t,
        ),
      })),
    renameCriterion: (id: string, newLabel: string) =>
      set((state) => ({
        criteria: state.criteria.map((c) =>
          c.id === id ? { ...c, label: newLabel } : c,
        ),
      })),
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
        version: 1,
        storage: createPughStorageAdapter(persister),
        partialize: (state) =>
          ({
            criteria: state.criteria,
            tools: state.tools,
            scores: state.scores,
            weights: state.weights,
          }) as unknown as PughStore,
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
