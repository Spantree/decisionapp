import type { ScaleType } from '../types';

export interface PughEventBase {
  id: string;
  timestamp: number;
  user: string;
  branchId: string;
  userId?: string;
  correlationId?: string;
}

// --- Kept unchanged ---

export interface MatrixCreated extends PughEventBase {
  type: 'MatrixCreated';
  title: string;
  description?: string;
  allowNegative: boolean;
  defaultScale: ScaleType;
}

export interface MatrixDefaultScaleSet extends PughEventBase {
  type: 'MatrixDefaultScaleSet';
  defaultScale: ScaleType;
}

export interface CriterionAdded extends PughEventBase {
  type: 'CriterionAdded';
  criterionId: string;
  label: string;
  scale?: ScaleType;
}

export interface CriterionRenamed extends PughEventBase {
  type: 'CriterionRenamed';
  criterionId: string;
  label: string;
}

export interface CriterionRemoved extends PughEventBase {
  type: 'CriterionRemoved';
  criterionId: string;
}

export interface CriterionScaleOverridden extends PughEventBase {
  type: 'CriterionScaleOverridden';
  criterionId: string;
  scale: ScaleType;
}

// --- Renamed events ---

export interface OptionAdded extends PughEventBase {
  type: 'OptionAdded';
  optionId: string;
  label: string;
}

export interface OptionRenamed extends PughEventBase {
  type: 'OptionRenamed';
  optionId: string;
  label: string;
}

export interface OptionRemoved extends PughEventBase {
  type: 'OptionRemoved';
  optionId: string;
}

export interface RatingAssigned extends PughEventBase {
  type: 'RatingAssigned';
  optionId: string;
  criterionId: string;
  value?: number;
  /** Overrides the criterion's default label for this score value */
  label?: string;
  comment?: string;
}

export interface CriterionWeightAdjusted extends PughEventBase {
  type: 'CriterionWeightAdjusted';
  criterionId: string;
  weight: number;
}

// --- New events ---

export interface MatrixTitleChanged extends PughEventBase {
  type: 'MatrixTitleChanged';
  title: string;
}

export interface MatrixDescriptionChanged extends PughEventBase {
  type: 'MatrixDescriptionChanged';
  description: string;
}

export interface MatrixArchived extends PughEventBase {
  type: 'MatrixArchived';
}

export interface CriterionDescriptionChanged extends PughEventBase {
  type: 'CriterionDescriptionChanged';
  criterionId: string;
  description: string;
}

export interface CriterionReordered extends PughEventBase {
  type: 'CriterionReordered';
  criterionId: string;
  position: number;
}

export interface OptionDescriptionChanged extends PughEventBase {
  type: 'OptionDescriptionChanged';
  optionId: string;
  description: string;
}

export interface OptionReordered extends PughEventBase {
  type: 'OptionReordered';
  optionId: string;
  position: number;
}

export interface RatingRemoved extends PughEventBase {
  type: 'RatingRemoved';
  optionId: string;
  criterionId: string;
}

export interface CommentAdded extends PughEventBase {
  type: 'CommentAdded';
  optionId: string;
  criterionId: string;
  comment: string;
}

export type PughEvent =
  | MatrixCreated
  | MatrixDefaultScaleSet
  | MatrixTitleChanged
  | MatrixDescriptionChanged
  | MatrixArchived
  | CriterionAdded
  | CriterionRenamed
  | CriterionRemoved
  | CriterionScaleOverridden
  | CriterionDescriptionChanged
  | CriterionReordered
  | CriterionWeightAdjusted
  | OptionAdded
  | OptionRenamed
  | OptionRemoved
  | OptionDescriptionChanged
  | OptionReordered
  | RatingAssigned
  | RatingRemoved
  | CommentAdded;
