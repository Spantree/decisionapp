# Lazy-Loaded Radar Chart with Recharts

- Status: accepted
- Deciders: eitah
- Date: 2026-02-19

Technical Story: `64e298d` - Add radar chart view with table/chart toggle (#20)

## Context and Problem Statement

Users wanted a visual way to compare options across criteria beyond the numeric table. A radar chart naturally maps to the multi-criteria structure of a Pugh matrix (one axis per criterion, one polygon per option). However, charting libraries are large and most users may never use the chart view.

## Decision Drivers

- Bundle size: recharts is ~200KB, must not bloat the default bundle
- Visual clarity: radar charts map naturally to multi-criteria comparison
- Code splitting: only load charting code when the user toggles to chart view

## Considered Options

- Always bundle recharts
- Lazy-load recharts via `React.lazy()` and `Suspense`
- Use D3 directly (smaller but more work)
- Use Chart.js or visx

## Decision Outcome

Chosen option: "Lazy-load recharts via React.lazy()", because it provides zero cost for users who never toggle to chart view. The `PughRadarChart` component is loaded only when the user clicks the chart toggle, with a `Suspense` fallback during load.

### Positive Consequences

- Zero impact on initial bundle size
- recharts provides a high-level declarative API matching React patterns
- Toggle between table and chart views is seamless after initial load

### Negative Consequences

- Brief loading delay on first chart toggle
- recharts is a large dependency even if lazy-loaded
- Radar charts become hard to read with many criteria (>8-10 axes)
