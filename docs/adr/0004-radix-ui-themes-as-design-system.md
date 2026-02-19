# Adopt Radix UI Themes as Design System

- Status: accepted
- Deciders: eitah
- Date: 2026-02-12

Technical Story: `d5cb0b8` - feat: replace HTML table with Radix UI Themes Table

## Context and Problem Statement

The component originally used plain HTML `<table>` elements with custom CSS. As the UI grew more complex (tooltips, hover interactions, form controls, drawers), a cohesive design system was needed for consistent typography, spacing, dark mode handling, and accessible defaults.

## Decision Drivers

- Consistent visual language across all UI elements
- Built-in accessible primitives (dialog, hover card, select, etc.)
- Dark mode support without custom CSS
- Ability to externalize from the bundle (peer dependency) to keep library small

## Considered Options

- Custom CSS only (existing approach)
- Radix UI Themes
- Shadcn/ui
- Material UI
- Chakra UI

## Decision Outcome

Chosen option: "Radix UI Themes", because it provides both low-level primitives (Dialog, HoverCard, Select) and a complete theme system (Table, Button, Text) with excellent accessibility defaults. It is externalized as a peer dependency (`>= 3.0.0`) so consumers who already use Radix don't pay for it twice.

### Positive Consequences

- Replaced all custom tooltip positioning CSS -- Radix handles placement, z-index, and portals
- Consistent dark/light theming via `<Theme>` provider
- Score cell colors later aligned to Radix color scales for full design consistency
- Accessible by default (keyboard nav, ARIA attributes, focus management)

### Negative Consequences

- Hard dependency on Radix ecosystem -- consumers must install `@radix-ui/themes`
- Radix styling opinions may conflict with consumer app theming
