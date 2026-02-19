import type { PughDomainState } from '../store/types';
import type { PughEvent } from './types';
import { DEFAULT_MATRIX_CONFIG } from '../types';
import type { MatrixConfig } from '../types';

export function projectEvents(events: PughEvent[]): PughDomainState {
  const criteria: PughDomainState['criteria'] = [];
  const options: PughDomainState['options'] = [];
  const ratings: PughDomainState['ratings'] = [];
  const weights: Record<string, number> = {};
  let matrixConfig: MatrixConfig = { ...DEFAULT_MATRIX_CONFIG };

  for (const event of events) {
    switch (event.type) {
      case 'MatrixCreated':
        matrixConfig = {
          allowNegative: event.allowNegative,
          defaultScale: event.defaultScale,
        };
        break;

      case 'MatrixDefaultScaleSet':
        matrixConfig = { ...matrixConfig, defaultScale: event.defaultScale };
        break;

      case 'MatrixTitleChanged':
      case 'MatrixDescriptionChanged':
      case 'MatrixArchived':
        // no-op: current state doesn't track these
        break;

      case 'CriterionAdded':
        criteria.push({
          id: event.criterionId,
          label: event.label,
          user: event.user,
          scale: event.scale,
        });
        weights[event.criterionId] = 10;
        break;

      case 'CriterionRenamed':
        for (let i = 0; i < criteria.length; i++) {
          if (criteria[i].id === event.criterionId) {
            criteria[i] = { ...criteria[i], label: event.label };
            break;
          }
        }
        break;

      case 'CriterionScaleOverridden':
        for (let i = 0; i < criteria.length; i++) {
          if (criteria[i].id === event.criterionId) {
            criteria[i] = { ...criteria[i], scale: event.scale };
            break;
          }
        }
        break;

      case 'CriterionDescriptionChanged':
        for (let i = 0; i < criteria.length; i++) {
          if (criteria[i].id === event.criterionId) {
            criteria[i] = { ...criteria[i], description: event.description };
            break;
          }
        }
        break;

      case 'CriterionReordered': {
        const critIdx = criteria.findIndex((c) => c.id === event.criterionId);
        if (critIdx !== -1) {
          const [item] = criteria.splice(critIdx, 1);
          criteria.splice(event.position, 0, item);
        }
        break;
      }

      case 'CriterionRemoved': {
        const idx = criteria.findIndex((c) => c.id === event.criterionId);
        if (idx !== -1) criteria.splice(idx, 1);
        delete weights[event.criterionId];
        // Remove ratings referencing this criterion
        for (let i = ratings.length - 1; i >= 0; i--) {
          if (ratings[i].criterionId === event.criterionId) ratings.splice(i, 1);
        }
        break;
      }

      case 'CriterionWeightAdjusted':
        weights[event.criterionId] = event.weight;
        break;

      case 'OptionAdded':
        options.push({ id: event.optionId, label: event.label, user: event.user });
        break;

      case 'OptionRenamed':
        for (let i = 0; i < options.length; i++) {
          if (options[i].id === event.optionId) {
            options[i] = { ...options[i], label: event.label };
            break;
          }
        }
        break;

      case 'OptionDescriptionChanged':
        for (let i = 0; i < options.length; i++) {
          if (options[i].id === event.optionId) {
            options[i] = { ...options[i], description: event.description };
            break;
          }
        }
        break;

      case 'OptionReordered': {
        const optIdx = options.findIndex((o) => o.id === event.optionId);
        if (optIdx !== -1) {
          const [item] = options.splice(optIdx, 1);
          options.splice(event.position, 0, item);
        }
        break;
      }

      case 'OptionRemoved': {
        const idx = options.findIndex((t) => t.id === event.optionId);
        if (idx !== -1) options.splice(idx, 1);
        // Remove ratings referencing this option
        for (let i = ratings.length - 1; i >= 0; i--) {
          if (ratings[i].optionId === event.optionId) ratings.splice(i, 1);
        }
        break;
      }

      case 'RatingAssigned':
        ratings.push({
          id: event.id,
          optionId: event.optionId,
          criterionId: event.criterionId,
          value: event.value,
          label: event.label,
          comment: event.comment,
          timestamp: event.timestamp,
          user: event.user,
        });
        break;

      case 'RatingRemoved':
        for (let i = ratings.length - 1; i >= 0; i--) {
          if (ratings[i].optionId === event.optionId && ratings[i].criterionId === event.criterionId) {
            ratings.splice(i, 1);
          }
        }
        break;

      case 'CommentAdded':
        ratings.push({
          id: event.id,
          optionId: event.optionId,
          criterionId: event.criterionId,
          value: undefined,
          comment: event.comment,
          timestamp: event.timestamp,
          user: event.user,
        });
        break;

      default: {
        const _exhaustive: never = event;
        void _exhaustive;
      }
    }
  }

  return { criteria, options, ratings, weights, matrixConfig };
}
