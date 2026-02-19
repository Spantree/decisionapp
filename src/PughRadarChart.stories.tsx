import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import PughRadarChart from './PughRadarChart';
import { createPughStore } from './store/createPughStore';
import { PughStoreProvider } from './store/PughStoreProvider';
import { ratingId } from './ids';
import type { Criterion, Option, RatingEntry } from './types';

const criteria: Criterion[] = [
  { id: 'cost', label: 'Cost', user: 'alice' },
  { id: 'performance', label: 'Performance', user: 'alice' },
  { id: 'ease-of-use', label: 'Ease of Use', user: 'alice' },
  { id: 'community', label: 'Community Support', user: 'alice' },
  { id: 'docs', label: 'Documentation', user: 'alice' },
];
const options: Option[] = [
  { id: 'react', label: 'React', user: 'alice' },
  { id: 'vue', label: 'Vue', user: 'alice' },
  { id: 'svelte', label: 'Svelte', user: 'alice' },
  { id: 'angular', label: 'Angular', user: 'alice' },
];

function entry(
  optionId: string,
  criterionId: string,
  value: number,
  label: string,
  timestamp: number,
): RatingEntry {
  return {
    id: ratingId(),
    optionId,
    criterionId,
    value,
    label,
    timestamp,
    user: 'alice',
  };
}

const t1 = 1707600000000;

const ratings: RatingEntry[] = [
  entry('react', 'cost', 9, 'Free', t1),
  entry('react', 'performance', 7, 'Good', t1),
  entry('react', 'ease-of-use', 6, 'Moderate', t1),
  entry('react', 'community', 10, 'Massive', t1),
  entry('react', 'docs', 8, 'Extensive', t1),

  entry('vue', 'cost', 9, 'Free', t1),
  entry('vue', 'performance', 8, 'Great', t1),
  entry('vue', 'ease-of-use', 9, 'Easy', t1),
  entry('vue', 'community', 7, 'Strong', t1),
  entry('vue', 'docs', 9, 'Excellent', t1),

  entry('svelte', 'cost', 9, 'Free', t1),
  entry('svelte', 'performance', 10, 'Fastest', t1),
  entry('svelte', 'ease-of-use', 8, 'Simple', t1),
  entry('svelte', 'community', 5, 'Growing', t1),
  entry('svelte', 'docs', 7, 'Good', t1),

  entry('angular', 'cost', 9, 'Free', t1),
  entry('angular', 'performance', 6, 'Decent', t1),
  entry('angular', 'ease-of-use', 4, 'Complex', t1),
  entry('angular', 'community', 8, 'Large', t1),
  entry('angular', 'docs', 8, 'Thorough', t1),
];

function StoryRadar({ height, isDark }: { height?: number; isDark?: boolean }) {
  const store = useMemo(
    () => createPughStore({ criteria, options, ratings }),
    [],
  );
  return (
    <div style={{ backgroundColor: isDark ? '#1e1e1e' : '#ffffff', padding: '1rem' }}>
      <PughStoreProvider store={store}>
        <PughRadarChart height={height} isDark={isDark} />
      </PughStoreProvider>
    </div>
  );
}

const meta: Meta<typeof StoryRadar> = {
  title: 'PughRadarChart',
  component: StoryRadar,
  argTypes: {
    height: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: 'Chart height in pixels',
    },
    isDark: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StoryRadar>;

export const Default: Story = {};

export const Tall: Story = {
  args: { height: 600 },
};

export const DarkMode: Story = {
  args: { isDark: true },
};
