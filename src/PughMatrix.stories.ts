import type { Meta, StoryObj } from '@storybook/react-vite';
import PughMatrix from './PughMatrix';
import './pugh-matrix.css';
import type { ScoreEntry } from './types';

const criteria = ['Cost', 'Performance', 'Ease of Use', 'Community Support', 'Documentation'];
const tools = ['React', 'Vue', 'Svelte', 'Angular'];

const scores: Record<string, Record<string, ScoreEntry>> = {
  React: {
    Cost: { score: 9, label: 'Free' },
    Performance: { score: 7, label: 'Good' },
    'Ease of Use': { score: 6, label: 'Moderate' },
    'Community Support': { score: 10, label: 'Massive' },
    Documentation: { score: 8, label: 'Extensive' },
  },
  Vue: {
    Cost: { score: 9, label: 'Free' },
    Performance: { score: 8, label: 'Great' },
    'Ease of Use': { score: 9, label: 'Easy' },
    'Community Support': { score: 7, label: 'Strong' },
    Documentation: { score: 9, label: 'Excellent' },
  },
  Svelte: {
    Cost: { score: 9, label: 'Free' },
    Performance: { score: 10, label: 'Fastest' },
    'Ease of Use': { score: 8, label: 'Simple' },
    'Community Support': { score: 5, label: 'Growing' },
    Documentation: { score: 7, label: 'Good' },
  },
  Angular: {
    Cost: { score: 9, label: 'Free' },
    Performance: { score: 6, label: 'Decent' },
    'Ease of Use': { score: 4, label: 'Complex' },
    'Community Support': { score: 8, label: 'Large' },
    Documentation: { score: 8, label: 'Thorough' },
  },
};

const meta: Meta<typeof PughMatrix> = {
  title: 'PughMatrix',
  component: PughMatrix,
  args: {
    criteria,
    tools,
    scores,
  },
  argTypes: {
    highlight: {
      control: 'select',
      options: [undefined, ...tools],
      description: 'Tool name to visually highlight a column',
    },
    showWinner: {
      control: 'boolean',
      description: 'Highlight the highest weighted-total column in gold with a crown',
    },
    isDark: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PughMatrix>;

/** Default rendering with no highlight or winner. */
export const Default: Story = {};

/** A single column highlighted with the `highlight` prop. */
export const HighlightVue: Story = {
  args: {
    highlight: 'Vue',
  },
};

/** Highlighting a different column for comparison. */
export const HighlightSvelte: Story = {
  args: {
    highlight: 'Svelte',
  },
};

/** Dark mode enabled. */
export const DarkMode: Story = {
  args: {
    isDark: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/** Dark mode with a highlighted column. */
export const DarkModeWithHighlight: Story = {
  args: {
    isDark: true,
    highlight: 'React',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/** Winner highlight enabled — crowns the highest weighted-total column in gold. */
export const ShowWinner: Story = {
  args: {
    showWinner: true,
  },
};

/** Winner and a separate highlight active at the same time. */
export const WinnerWithHighlight: Story = {
  args: {
    showWinner: true,
    highlight: 'Angular',
  },
};

/** Winner highlight in dark mode. */
export const WinnerDarkMode: Story = {
  args: {
    showWinner: true,
    isDark: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
