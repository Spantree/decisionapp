# Extract as Standalone React Component Library

- Status: accepted
- Deciders: eitah
- Date: 2026-02-10

Technical Story: `b49053c` - feat: add pugh matrix component with dark mode fix

## Context and Problem Statement

The Pugh Decision Matrix component was originally embedded in a Docusaurus site ("fluent-workshop"). It needed to be usable in any React application, not just the specific Docusaurus project.

## Decision Drivers

- Portability across React hosts (Docusaurus, Vite, Next.js, etc.)
- Clean dependency boundary (no Docusaurus-specific APIs)
- Dual CJS/ESM output for broad consumer compatibility

## Considered Options

- Keep it embedded in Docusaurus
- Publish as a Docusaurus plugin
- Extract as a standalone React component library with tsup

## Decision Outcome

Chosen option: "Extract as a standalone React component library with tsup", because it provides maximum portability. tsup generates CJS, ESM, and TypeScript declarations with minimal configuration (9-line config). The component accepts a `isDark` prop instead of relying on Docusaurus `useColorMode`, and uses CSS custom properties instead of IFM variables.

### Positive Consequences

- Works in any React 18+ application
- Zero-config bundling with tsup
- Consumers get full TypeScript support via generated `.d.ts` files

### Negative Consequences

- Need to manage peer dependencies (React, Radix UI)
- Lost Docusaurus-specific features like automatic dark mode detection
