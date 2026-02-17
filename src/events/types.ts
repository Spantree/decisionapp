import type { ScoreScale } from '../types';

interface PughEventBase {
  id: string;
  timestamp: number;
  user: string;
}

export interface CriterionAdded extends PughEventBase {
  type: 'CriterionAdded';
  criterionId: string;
  label: string;
  scoreScale?: ScoreScale;
}

export interface CriterionRenamed extends PughEventBase {
  type: 'CriterionRenamed';
  criterionId: string;
  newLabel: string;
}

export interface CriterionRemoved extends PughEventBase {
  type: 'CriterionRemoved';
  criterionId: string;
}

export interface CriterionScaleChanged extends PughEventBase {
  type: 'CriterionScaleChanged';
  criterionId: string;
  scoreScale: ScoreScale;
}

export interface ToolAdded extends PughEventBase {
  type: 'ToolAdded';
  toolId: string;
  label: string;
}

export interface ToolRenamed extends PughEventBase {
  type: 'ToolRenamed';
  toolId: string;
  newLabel: string;
}

export interface ToolRemoved extends PughEventBase {
  type: 'ToolRemoved';
  toolId: string;
}

export interface ScoreSet extends PughEventBase {
  type: 'ScoreSet';
  toolId: string;
  criterionId: string;
  score?: number;
  /** Overrides the criterion's default label for this score value */
  label?: string;
  comment?: string;
}

export interface WeightSet extends PughEventBase {
  type: 'WeightSet';
  criterionId: string;
  weight: number;
}

export type PughEvent =
  | CriterionAdded
  | CriterionRenamed
  | CriterionRemoved
  | CriterionScaleChanged
  | ToolAdded
  | ToolRenamed
  | ToolRemoved
  | ScoreSet
  | WeightSet;

export interface Branch {
  id: string;
  name: string;
  createdAt: number;
  parentBranchId?: string;
  forkEventIndex?: number;
}
