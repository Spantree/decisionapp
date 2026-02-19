# Record Architecture Decisions

- Status: accepted
- Deciders: eitah
- Date: 2026-02-19

## Context and Problem Statement

The decisions-cc project has evolved rapidly through many architectural pivots visible in the commit history. How do we capture the reasoning behind these decisions so that future contributors (and our future selves) understand why things are the way they are?

## Decision Drivers

- Decisions are hard to reconstruct from code alone
- The project has undergone significant architectural evolution
- New contributors need context on why certain approaches were chosen

## Considered Options

- No formal documentation
- Inline code comments
- Architecture Decision Records (MADR format)

## Decision Outcome

Chosen option: "Architecture Decision Records (MADR format)", because they provide a lightweight, structured, and version-controlled way to document decisions alongside the code. The MADR template captures context, alternatives, and trade-offs in a consistent format.

### Positive Consequences

- Decisions are discoverable and searchable
- Each ADR is self-contained with context and rationale
- ADRs can reference and supersede each other

### Negative Consequences

- Requires discipline to create ADRs for new decisions
- Retroactive ADRs may miss nuance from the original discussion
