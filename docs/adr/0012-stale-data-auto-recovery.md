# Auto-Detect Stale Stored Data and Re-Seed

- Status: accepted
- Deciders: eitah
- Date: 2026-02-19

Technical Story: `31514c1` - Auto-detect stale stored data and re-seed on init

## Context and Problem Statement

The domain rename (ADR-0010) changed event type names (`ToolAdded` -> `OptionAdded`, etc.). Users with pre-rename events in localStorage would see a blank matrix because `projectEvents()` no longer recognized the old event types. How should the application handle incompatible stored data?

## Decision Drivers

- Users should not see a broken blank UI
- No manual "clear data" button needed
- Preserve data when possible, re-seed only when truly incompatible
- Simple detection heuristic (no event versioning system)

## Considered Options

- Event migration/versioning (transform old events to new format)
- Manual "clear data" button
- Auto-detect stale data and re-seed from defaults

## Decision Outcome

Chosen option: "Auto-detect stale data and re-seed", because it handles the specific problem (incompatible event types after rename) with minimal complexity. The heuristic: when `init()` hydrates from the repository and finds zero options in the projected state, but the seed data has options, it assumes stored events are incompatible. It deletes the stale ref and re-seeds.

### Positive Consequences

- Users never see a broken blank state
- No manual intervention required
- Simple heuristic that catches the actual failure mode

### Negative Consequences

- Destructive: stale data is deleted, not migrated
- Heuristic could false-positive if a user intentionally deleted all options
- Does not solve the general event versioning problem -- future schema changes may need a different approach
