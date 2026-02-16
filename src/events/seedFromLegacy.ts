import type { Criterion, Tool, ScoreEntry } from '../types';
import type { PughEvent } from './types';

export interface SeedOptions {
  criteria?: Criterion[];
  tools?: Tool[];
  scores?: ScoreEntry[];
  weights?: Record<string, number>;
}

export function seedEventsFromOptions(opts: SeedOptions): PughEvent[] {
  const events: PughEvent[] = [];
  const now = Date.now();
  let seq = 0;

  for (const c of opts.criteria ?? []) {
    events.push({
      id: `seed-${seq++}`,
      type: 'CriterionAdded',
      criterionId: c.id,
      label: c.label,
      timestamp: now,
      user: c.user,
    });
  }

  // Set explicit weights (overriding the default 10 from CriterionAdded)
  if (opts.weights) {
    for (const [criterionId, weight] of Object.entries(opts.weights)) {
      if (weight !== 10) {
        events.push({
          id: `seed-${seq++}`,
          type: 'WeightSet',
          criterionId,
          weight,
          timestamp: now,
          user: 'system',
        });
      }
    }
  }

  for (const t of opts.tools ?? []) {
    events.push({
      id: `seed-${seq++}`,
      type: 'ToolAdded',
      toolId: t.id,
      label: t.label,
      timestamp: now,
      user: t.user,
    });
  }

  for (const s of opts.scores ?? []) {
    events.push({
      id: `seed-${seq++}`,
      type: 'ScoreSet',
      toolId: s.toolId,
      criterionId: s.criterionId,
      score: s.score,
      label: s.label,
      comment: s.comment,
      timestamp: s.timestamp,
      user: s.user,
    });
  }

  return events;
}
