# Standardize Domain Naming: Tool to Option, Score to Rating

- Status: accepted
- Deciders: eitah
- Date: 2026-02-18

Technical Story: `1106683` - Standardize event types: rename Tool -> Option, Score -> Rating (#6)

## Context and Problem Statement

The component was originally extracted from a project comparing software tools, so the domain language used "Tool" for columns and "Score" for cell values. As the component generalized to any decision matrix, these names became misleading. A Pugh matrix compares "Options" and assigns "Ratings", not "Tools" and "Scores."

## Decision Drivers

- Align with standard Pugh matrix terminology
- "Rating" conveys subjectivity better than "Score" (ratings are opinions, scores feel objective)
- Consistency across types, events, store actions, CSS classes, and UI text

## Considered Options

- Keep "Tool" and "Score" (status quo)
- Rename to "Option" and "Rating" (standard Pugh terminology)
- Rename to "Alternative" and "Assessment"

## Decision Outcome

Chosen option: "Rename to Option and Rating", because these are the standard terms in Pugh matrix literature. The rename was comprehensive: TypeScript types, event names (`ToolAdded` -> `OptionAdded`, `ScoreAssigned` -> `RatingAssigned`), Zustand store actions, CSS class names, and all UI-facing text.

### Positive Consequences

- Domain language now matches Pugh matrix literature
- "Rating" sets correct user expectations (subjective assessment)
- Consistent naming across all layers of the codebase

### Negative Consequences

- Breaking change for stored events: old `ToolAdded` events are not understood by the new `projectEvents()` function (mitigated by ADR-0012)
- Required a comprehensive codebase-wide rename
