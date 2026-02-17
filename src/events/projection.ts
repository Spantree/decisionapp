import type { PughDomainState } from '../store/types';
import type { PughEvent } from './types';
import { DEFAULT_SCALE } from '../types';

export function projectEvents(events: PughEvent[]): PughDomainState {
  const criteria: PughDomainState['criteria'] = [];
  const tools: PughDomainState['tools'] = [];
  const scores: PughDomainState['scores'] = [];
  const weights: Record<string, number> = {};

  for (const event of events) {
    switch (event.type) {
      case 'CriterionAdded':
        criteria.push({
          id: event.criterionId,
          label: event.label,
          user: event.user,
          scoreScale: event.scoreScale ?? DEFAULT_SCALE,
        });
        weights[event.criterionId] = 10;
        break;

      case 'CriterionRenamed':
        for (let i = 0; i < criteria.length; i++) {
          if (criteria[i].id === event.criterionId) {
            criteria[i] = { ...criteria[i], label: event.newLabel };
            break;
          }
        }
        break;

      case 'CriterionScaleChanged':
        for (let i = 0; i < criteria.length; i++) {
          if (criteria[i].id === event.criterionId) {
            criteria[i] = { ...criteria[i], scoreScale: event.scoreScale };
            break;
          }
        }
        break;

      case 'CriterionRemoved': {
        const idx = criteria.findIndex((c) => c.id === event.criterionId);
        if (idx !== -1) criteria.splice(idx, 1);
        delete weights[event.criterionId];
        // Remove scores referencing this criterion
        for (let i = scores.length - 1; i >= 0; i--) {
          if (scores[i].criterionId === event.criterionId) scores.splice(i, 1);
        }
        break;
      }

      case 'ToolAdded':
        tools.push({ id: event.toolId, label: event.label, user: event.user });
        break;

      case 'ToolRenamed':
        for (let i = 0; i < tools.length; i++) {
          if (tools[i].id === event.toolId) {
            tools[i] = { ...tools[i], label: event.newLabel };
            break;
          }
        }
        break;

      case 'ToolRemoved': {
        const idx = tools.findIndex((t) => t.id === event.toolId);
        if (idx !== -1) tools.splice(idx, 1);
        // Remove scores referencing this tool
        for (let i = scores.length - 1; i >= 0; i--) {
          if (scores[i].toolId === event.toolId) scores.splice(i, 1);
        }
        break;
      }

      case 'ScoreSet':
        scores.push({
          id: event.id,
          toolId: event.toolId,
          criterionId: event.criterionId,
          score: event.score,
          label: event.label,
          comment: event.comment,
          timestamp: event.timestamp,
          user: event.user,
        });
        break;

      case 'WeightSet':
        weights[event.criterionId] = event.weight;
        break;
    }
  }

  return { criteria, tools, scores, weights };
}
