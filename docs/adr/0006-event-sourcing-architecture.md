# Event Sourcing for Domain State

- Status: accepted
- Deciders: eitah
- Date: 2026-02-16

Technical Story: `1e62bce` - Branch selector added to pugh matrix

## Context and Problem Statement

The application needed to support branching (exploring alternative scorings), diffing (comparing branches), merging, and undo history. Direct state mutation made these operations impossible without deep cloning and manual diff logic. How should domain state be modeled to support these capabilities?

## Decision Drivers

- Branching: explore "what-if" scenarios without losing the original
- Diffing: compare two branches to see what changed
- Merging: combine changes from different branches
- History: full audit trail of who changed what and when
- User attribution on every change

## Considered Options

- Direct state mutation (existing approach)
- Event sourcing with typed events and projection
- CRDT-based sync
- Operational transforms

## Decision Outcome

Chosen option: "Event sourcing with typed events and projection", because domain state is always derivable from replaying the event log. This makes branching trivial (fork the event stream), diffing straightforward (compare projected states), and history free (events are the history).

The implementation uses a TypeScript discriminated union (`PughEvent`) with event types including: `MatrixCreated`, `CriterionAdded`, `CriterionRenamed`, `CriterionRemoved`, `OptionAdded`, `OptionRenamed`, `OptionRemoved`, `RatingAssigned`, `CriterionWeightAdjusted`, `CommentAdded`, and more. A `projectEvents()` function folds the event array into the current `PughState`.

### Positive Consequences

- Branching is just forking the event array
- Full audit trail with user attribution and timestamps
- State is always reconstructable -- no migration needed for UI changes
- New projections can be added without changing stored data

### Negative Consequences

- Schema evolution is harder -- renaming event types (e.g., `ToolAdded` -> `OptionAdded`) broke old stored events (see ADR-0012)
- Projection must be replayed on every state access (mitigated by caching)
- Event arrays grow unbounded (no compaction yet)
