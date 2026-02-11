import { useState, useMemo } from 'react';
import type { ScoreEntry } from './types';
import './pugh-matrix.css';

export interface PughMatrixProps {
  criteria: string[];
  tools: string[];
  scores: Record<string, Record<string, ScoreEntry>>;
  highlight?: string;
  showWinner?: boolean;
  isDark?: boolean;
}

const scoreColorCache = new Map<string, { bg: string; text: string }>();

function getScoreColor(
  score: number,
  isDark: boolean,
): { bg: string; text: string } {
  const key = `${score}-${isDark}`;
  const cached = scoreColorCache.get(key);
  if (cached) return cached;

  const ratio = Math.max(0, Math.min(1, (score - 1) / 9));
  const hue = ratio * 120;
  const result = isDark
    ? { bg: `hsl(${hue}, 45%, 22%)`, text: `hsl(${hue}, 60%, 78%)` }
    : { bg: `hsl(${hue}, 75%, 90%)`, text: `hsl(${hue}, 80%, 25%)` };
  scoreColorCache.set(key, result);
  return result;
}

export default function PughMatrix({
  criteria,
  tools,
  scores,
  highlight,
  showWinner = false,
  isDark = false,
}: PughMatrixProps) {
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(criteria.map((c) => [c, 10])),
  );

  const [showTotals, setShowTotals] = useState(false);

  const { weightedTotals, maxTotal, winner } = useMemo(() => {
    const totals: Record<string, number> = {};
    let max = -Infinity;
    let best = '';
    for (const tool of tools) {
      let total = 0;
      for (const criterion of criteria) {
        const entry = scores[tool]?.[criterion];
        const score = entry?.score ?? 0;
        const weight = weights[criterion] ?? 10;
        total += score * weight;
      }
      const rounded = Math.round(total * 10) / 10;
      totals[tool] = rounded;
      if (rounded > max) {
        max = rounded;
        best = tool;
      }
    }
    return {
      weightedTotals: totals,
      maxTotal: max,
      winner: showWinner ? best : null,
    };
  }, [criteria, tools, scores, weights, showWinner]);

  const handleWeightChange = (criterion: string, value: string) => {
    if (value === '') {
      setWeights((prev) => ({ ...prev, [criterion]: 0 }));
      return;
    }
    const num = Math.round(Number(value));
    if (!isNaN(num) && num >= 0 && num <= 10) {
      setWeights((prev) => ({ ...prev, [criterion]: num }));
    }
  };

  const isHighlighted = (tool: string) => highlight && tool === highlight;
  const isWinner = (tool: string) => winner && tool === winner;

  return (
    <div className={`pugh-container${isDark ? ' pugh-dark' : ''}`}>
      <table className="pugh-table">
        <thead>
          <tr>
            <th className="pugh-criterion-header">Criterion</th>
            <th className="pugh-weight-header">Weight</th>
            {tools.map((tool) => (
              <th
                key={tool}
                className={`pugh-tool-header${isWinner(tool) ? ' pugh-winner-header' : isHighlighted(tool) ? ' pugh-highlight-header' : ''}`}
              >
                {isWinner(tool) ? `👑 ${tool}` : tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion) => (
            <tr key={criterion}>
              <td className="pugh-criterion-cell">{criterion}</td>
              <td className="pugh-weight-cell">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={weights[criterion]}
                  onChange={(e) => handleWeightChange(criterion, e.target.value)}
                  className="pugh-weight-input"
                />
              </td>
              {tools.map((tool) => {
                const entry = scores[tool]?.[criterion];
                const score = entry?.score ?? 0;
                const label = entry?.label ?? '';
                const colors = getScoreColor(score, isDark);
                return (
                  <td
                    key={tool}
                    className={`pugh-score-cell${isWinner(tool) ? ' pugh-winner-cell' : isHighlighted(tool) ? ' pugh-highlight-cell' : ''}`}
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    <span className="pugh-score-number">{score}</span>
                    {label && (
                      <span className="pugh-score-label">{label}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          {showTotals && (
            <tr className="pugh-total-row">
              <td className="pugh-total-label">Weighted Total</td>
              <td className="pugh-weight-cell" />
              {tools.map((tool) => {
                const total = weightedTotals[tool];
                const colors = getScoreColor(
                  (total / maxTotal) * 10,
                  isDark,
                );
                return (
                  <td
                    key={tool}
                    className={`pugh-total-cell${isWinner(tool) ? ' pugh-winner-cell' : isHighlighted(tool) ? ' pugh-highlight-cell' : ''}`}
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {total}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="pugh-toggle-button"
        onClick={() => setShowTotals((prev) => !prev)}
        type="button"
      >
        {showTotals ? 'Hide Totals' : 'Show Totals'}
      </button>
    </div>
  );
}
