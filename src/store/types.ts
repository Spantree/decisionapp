import type { Criterion, Tool, ScoreEntry } from '../types';

export interface PughDomainState {
  criteria: Criterion[];
  tools: Tool[];
  scores: ScoreEntry[];
  weights: Record<string, number>;
}

export interface PughUIState {
  showTotals: boolean;
  editingCell: { toolId: string; criterionId: string } | null;
  editScore: string;
  editLabel: string;
  editComment: string;
}

export interface PughActions {
  setCriteria: (criteria: Criterion[]) => void;
  setTools: (tools: Tool[]) => void;
  addScore: (entry: ScoreEntry) => void;
  setWeight: (criterionId: string, weight: number) => void;
  setShowTotals: (show: boolean) => void;
  toggleTotals: () => void;
  startEditing: (toolId: string, criterionId: string) => void;
  cancelEditing: () => void;
  setEditScore: (score: string) => void;
  setEditLabel: (label: string) => void;
  setEditComment: (comment: string) => void;
  renameTool: (id: string, newLabel: string) => void;
  renameCriterion: (id: string, newLabel: string) => void;
}

export type PughStore = PughDomainState & PughUIState & PughActions;
