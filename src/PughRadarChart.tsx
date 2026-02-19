import { useMemo, useCallback, useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { usePughStore } from './store/usePughStore';

export interface PughRadarChartProps {
  /** Chart width — ignored when `responsive` is true (default). */
  width?: number;
  /** Chart height — used as the container height when `responsive` is true. */
  height?: number;
  /** Wrap chart in a ResponsiveContainer (default true). */
  responsive?: boolean;
  /** Enable dark mode styling. */
  isDark?: boolean;
}

const COLORS_LIGHT = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#a4de6c',
  '#d0ed57',
  '#8dd1e1',
  '#ff6b6b',
];

const COLORS_DARK = [
  '#b4b0ff',
  '#a8e6c1',
  '#ffd97a',
  '#ff9a7f',
  '#c4f29c',
  '#e2f785',
  '#aee4f0',
  '#ff9494',
];

export default function PughRadarChart({
  width = 500,
  height = 400,
  responsive = true,
  isDark = false,
}: PughRadarChartProps) {
  const criteria = usePughStore((s) => s.criteria);
  const options = usePughStore((s) => s.options);
  const ratings = usePughStore((s) => s.ratings);

  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const handleLegendClick = useCallback((entry: { value?: string }) => {
    const label = entry.value;
    if (!label) return;
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;
  const textColor = isDark ? '#e3e3e3' : '#1c1e21';
  const gridColor = isDark ? '#444' : '#dee2e6';

  const data = useMemo(() => {
    const latest = new Map<string, number>();
    for (const entry of ratings) {
      if (entry.value == null) continue;
      const key = `${entry.optionId}\0${entry.criterionId}`;
      latest.set(key, entry.value);
    }

    return criteria.map((criterion) => {
      const point: Record<string, string | number> = {
        criterion: criterion.label,
      };
      for (const option of options) {
        const key = `${option.id}\0${criterion.id}`;
        point[option.label] = latest.get(key) ?? 0;
      }
      return point;
    });
  }, [criteria, options, ratings]);

  const chart = (
    <RadarChart data={data} width={responsive ? undefined : width} height={responsive ? undefined : height}>
      <PolarGrid stroke={gridColor} />
      <PolarAngleAxis dataKey="criterion" tick={{ fill: textColor, fontSize: 12 }} />
      <PolarRadiusAxis domain={[0, 10]} tickCount={6} tick={{ fill: textColor, fontSize: 10 }} stroke={gridColor} />
      {options.map((option, i) => (
        <Radar
          key={option.id}
          name={option.label}
          dataKey={option.label}
          stroke={colors[i % colors.length]}
          fill={colors[i % colors.length]}
          fillOpacity={0.15}
          hide={hiddenSeries.has(option.label)}
        />
      ))}
      <Legend
        wrapperStyle={{ color: textColor, cursor: 'pointer' }}
        onClick={handleLegendClick}
        formatter={(value: string) => (
          <span style={{ color: hiddenSeries.has(value) ? '#999' : textColor, textDecoration: hiddenSeries.has(value) ? 'line-through' : 'none' }}>
            {value}
          </span>
        )}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${gridColor}`,
          color: textColor,
        }}
      />
    </RadarChart>
  );

  if (responsive) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {chart}
      </ResponsiveContainer>
    );
  }

  return chart;
}
