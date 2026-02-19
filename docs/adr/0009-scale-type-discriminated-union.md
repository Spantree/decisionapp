# ScaleType Discriminated Union for Flexible Scoring

- Status: accepted
- Deciders: eitah
- Date: 2026-02-17

Technical Story: `22938af` - Replace ScoreScale with ScaleType union; `ab3fec4` - Add score scale & label set selection (#15)

## Context and Problem Statement

Different criteria in a decision matrix need different scoring methods. A "Cost" criterion might use a 1-10 numeric scale, a "Has CI/CD" criterion is binary yes/no, and a "GitHub Stars" criterion is an unbounded real-world count. How should the type system model these fundamentally different scoring approaches?

## Decision Drivers

- Type safety: prevent assigning a binary value to a numeric criterion
- Normalization: all scale types must produce comparable weighted totals
- Per-criterion customization: each criterion can have its own scale
- Label sets: semantic meaning for score values (e.g., 1="Poor", 10="Excellent")

## Considered Options

- Fixed 1-10 scale for everything (original approach)
- Enum-based scale types
- Discriminated union: `{ kind: 'numeric' | 'binary' | 'unbounded' }`

## Decision Outcome

Chosen option: "Discriminated union", because TypeScript's discriminated unions provide exhaustive pattern matching and per-variant fields:

- `{ kind: 'numeric', min, max, step, labels? }` -- bounded numeric range
- `{ kind: 'binary' }` -- yes/no toggle
- `{ kind: 'unbounded' }` -- real-world counts, normalized proportionally

Matrix-level config (`allowNegative`, `defaultScale`) sets defaults; per-criterion `scaleOverride` allows customization. A `LabelSet` system with presets (Quality, Cost, Ease of Use, Agreement) maps ranges to semantic labels.

### Positive Consequences

- Exhaustive `switch` on `kind` catches missing cases at compile time
- Normalization logic is co-located with each scale type
- Custom label sets allow user-defined semantics per criterion
- Presets reduce friction for common use cases

### Negative Consequences

- More complex scoring UI -- each scale type needs different input controls
- Label resolution uses round-down logic which may surprise users
