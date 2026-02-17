import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BranchSelector } from './BranchSelector';
import PughMatrix from './PughMatrix';
import { createPughStore } from './store/createPughStore';
import { createLocalStoragePersister } from './persist/localStoragePersister';
import { PughStoreProvider } from './store/PughStoreProvider';
import { scoreId, toolId as makeToolId, MAIN_BRANCH_ID } from './ids';
import { SCALE_1_10 } from './types';
import './pugh-matrix.css';

const criteria = [
  { id: 'cost', label: 'Cost', user: 'alice', scoreScale: SCALE_1_10 },
  { id: 'performance', label: 'Performance', user: 'alice', scoreScale: SCALE_1_10 },
  { id: 'ease-of-use', label: 'Ease of Use', user: 'alice', scoreScale: SCALE_1_10 },
];
const tools = [
  { id: 'react', label: 'React', user: 'alice' },
  { id: 'vue', label: 'Vue', user: 'alice' },
  { id: 'svelte', label: 'Svelte', user: 'alice' },
];

const [costCri, perfCri, eouCri] = criteria;
const [reactTool, vueTool, svelteTool] = tools;

function StoryBranchSelector({
  isDark,
  prePopulateBranches,
  showMatrix,
  persistKey,
}: {
  isDark?: boolean;
  prePopulateBranches?: boolean;
  showMatrix?: boolean;
  persistKey?: string;
}) {
  const [resetKey, setResetKey] = useState(0);
  const store = useMemo(() => {
    // Check for persisted data BEFORE creating the store so seeding
    // never races with rehydration.
    const hasSavedData = persistKey && (() => { try { return !!localStorage.getItem(persistKey); } catch { return false; } })();
    const s = createPughStore({
      criteria,
      tools,
      ...(persistKey && {
        persistKey,
        persister: createLocalStoragePersister(),
      }),
    });
    if (prePopulateBranches && !hasSavedData) {
      const state = () => s.getState();
      const t = Date.now();

      // -- main: moderate baseline (yellows/limes) --
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: costCri.id, score: 5, label: 'Moderate', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: perfCri.id, score: 6, label: 'Decent', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: eouCri.id, score: 5, label: 'Average', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: costCri.id, score: 6, label: 'Fair', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: perfCri.id, score: 5, label: 'OK', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: eouCri.id, score: 7, label: 'Good', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: costCri.id, score: 7, label: 'Cheap', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: perfCri.id, score: 6, label: 'Decent', timestamp: t, user: 'alice' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: eouCri.id, score: 5, label: 'Average', timestamp: t, user: 'alice' });

      // -- 'pro-react': Bob loves React, adds Angular, tanks the rest --
      state().createBranch('pro-react');
      const angularId = makeToolId();
      state().addTool(angularId, 'Angular', 'bob');
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: costCri.id, score: 10, label: 'Free!', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: perfCri.id, score: 10, label: 'Blazing', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: reactTool.id, criterionId: eouCri.id, score: 9, label: 'Great DX', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: costCri.id, score: 2, label: 'Expensive', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: perfCri.id, score: 1, label: 'Slow', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: eouCri.id, score: 3, label: 'Confusing', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: costCri.id, score: 2, label: 'Niche', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: perfCri.id, score: 3, label: 'Unproven', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: eouCri.id, score: 2, label: 'Weird', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: angularId, criterionId: costCri.id, score: 8, label: 'Free', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: angularId, criterionId: perfCri.id, score: 7, label: 'Solid', timestamp: t + 1, user: 'bob' });
      state().addScore({ id: scoreId(), toolId: angularId, criterionId: eouCri.id, score: 4, label: 'Steep', timestamp: t + 1, user: 'bob' });

      // -- 'svelte-wins': Carol removes React, renames criterion, Svelte dominates --
      state().switchBranch(MAIN_BRANCH_ID);
      state().createBranch('svelte-wins');
      state().removeTool(reactTool.id);
      state().renameCriterion(eouCri.id, 'Developer Joy');
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: costCri.id, score: 10, label: 'Free', timestamp: t + 2, user: 'carol' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: perfCri.id, score: 10, label: 'Fastest', timestamp: t + 2, user: 'carol' });
      state().addScore({ id: scoreId(), toolId: svelteTool.id, criterionId: eouCri.id, score: 10, label: 'Joyful', timestamp: t + 2, user: 'carol' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: costCri.id, score: 3, label: 'Costly', timestamp: t + 2, user: 'carol' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: perfCri.id, score: 4, label: 'Meh', timestamp: t + 2, user: 'carol' });
      state().addScore({ id: scoreId(), toolId: vueTool.id, criterionId: eouCri.id, score: 3, label: 'Tedious', timestamp: t + 2, user: 'carol' });

      // Start on main
      state().switchBranch(MAIN_BRANCH_ID);
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prePopulateBranches, persistKey, resetKey]);

  const handleClear = persistKey
    ? () => {
        try { localStorage.removeItem(persistKey); } catch {}
        setResetKey((k) => k + 1);
      }
    : undefined;

  return (
    <PughStoreProvider store={store}>
      {handleClear && (
        <div style={{ marginBottom: 8 }}>
          <button
            type="button"
            onClick={handleClear}
            style={{ fontSize: 13, cursor: 'pointer', padding: '4px 10px' }}
          >
            Clear saved data
          </button>
        </div>
      )}
      <BranchSelector isDark={isDark} />
      {showMatrix && (
        <PughMatrix isDark={isDark} />
      )}
    </PughStoreProvider>
  );
}

const meta: Meta<typeof StoryBranchSelector> = {
  title: 'BranchSelector',
  component: StoryBranchSelector,
  argTypes: {
    isDark: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
    prePopulateBranches: {
      control: 'boolean',
      description: 'Pre-populate with multiple branches',
    },
    showMatrix: {
      control: 'boolean',
      description: 'Show a PughMatrix below the branch selector',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StoryBranchSelector>;

/** Default — single main branch. */
export const Default: Story = {};

/** Multiple branches: main + pro-react + svelte-wins. */
export const MultipleBranches: Story = {
  args: {
    prePopulateBranches: true,
  },
};

/** Dark mode styling. */
export const DarkMode: Story = {
  args: {
    isDark: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/** Branch selector with an embedded PughMatrix — edits and branches persist across reloads. */
export const WithMatrix: Story = {
  args: {
    prePopulateBranches: true,
    showMatrix: true,
    persistKey: 'pugh-branch-demo',
  },
};

/** WithMatrix in dark mode — edits and branches persist across reloads. */
export const WithMatrixDark: Story = {
  args: {
    prePopulateBranches: true,
    showMatrix: true,
    isDark: true,
    persistKey: 'pugh-branch-demo-dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
