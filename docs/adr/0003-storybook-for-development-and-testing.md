# Use Storybook for Development and Visual Testing

- Status: accepted
- Deciders: eitah
- Date: 2026-02-11

Technical Story: `3444004` - feat: replace demo site with Storybook

## Context and Problem Statement

The project initially used a standalone Vite demo site in a `demo/` directory to visualize and test the component. As the component grew more complex with multiple states (highlight modes, dark mode, read-only, various scale types), a more structured approach to cataloging and testing component variants was needed.

## Decision Drivers

- Need to visualize many component state combinations
- Visual regression testing capability
- Accessibility testing integration
- Developer documentation for component props

## Considered Options

- Vite demo site (existing approach)
- Storybook with @storybook/react-vite
- Ladle
- Histoire

## Decision Outcome

Chosen option: "Storybook with @storybook/react-vite", because it provides the richest ecosystem for component development. Storybook enables visual regression testing via Chromatic, accessibility auditing via `@storybook/addon-a11y`, and serves as living documentation.

### Positive Consequences

- Each component state is an isolated, reproducible story
- Chromatic integration catches visual regressions automatically
- Accessibility addon flags a11y issues during development

### Negative Consequences

- Storybook adds significant dev dependencies
- Chromatic runs were initially attempted in CF Pages (which does shallow clones, breaking baseline detection) and had to be moved to GitHub Actions
