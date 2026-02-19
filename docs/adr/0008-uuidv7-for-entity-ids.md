# Use UUIDv7 with Typed Prefixes for Entity IDs

- Status: accepted
- Deciders: eitah
- Date: 2026-02-17

Technical Story: `1106683` - Replace crypto.randomUUID with UUIDv7

## Context and Problem Statement

The project uses IDs extensively: events, options, criteria, ratings, commits, branches. Initially `crypto.randomUUID()` (v4) was used, but IDs needed to be chronologically sortable for event ordering and human-distinguishable by type for debugging.

## Decision Drivers

- Chronological ordering without a separate timestamp field
- Type-distinguishable at a glance during debugging
- No collision risk across concurrent clients
- No server-side coordination required

## Considered Options

- `crypto.randomUUID()` (UUID v4, used initially)
- UUIDv7 with typed prefixes
- nanoid
- ULID
- Auto-incrementing integers

## Decision Outcome

Chosen option: "UUIDv7 with typed prefixes", because UUIDv7 embeds a millisecond-precision timestamp in the high bits, providing natural chronological ordering. Typed prefixes (e.g., `evt_`, `opt_`, `cri_`, `rating_`, `commit_`, `br_`) make IDs self-documenting.

Format: `<prefix>_<uuidv7>` (e.g., `evt_0190a3f1-7b3c-7def-8901-234567890abc`)

### Positive Consequences

- Events sort chronologically by ID alone
- `evt_` vs `opt_` vs `cri_` prefixes make debugging logs immediately readable
- No coordination needed -- safe for future multi-client scenarios
- Replaced the `uuidv7` npm package for generation

### Negative Consequences

- Slightly longer IDs than nanoid/ULID
- Prefix convention must be maintained by discipline (not enforced by types)
