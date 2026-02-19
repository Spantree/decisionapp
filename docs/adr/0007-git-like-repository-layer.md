# Git-Like Repository Layer for Branching and Merging

- Status: accepted
- Deciders: eitah
- Date: 2026-02-17

Technical Story: `b7ee12f` - Add branch diff/merge UI to BranchSelector (#16)

## Context and Problem Statement

With event sourcing in place, the project needed a way to persist, branch, diff, and merge event streams. A simpler persistence layer (localStorage per branch key) was tried first but lacked support for commit history, LCA-based diffing, and three-way merge. How should branching and persistence be structured?

## Decision Drivers

- Commit history with parent references (not just latest state)
- Fork from any commit, not just HEAD
- Three-way merge with conflict resolution strategies
- Pluggable storage backends (memory for tests, localStorage for production)

## Considered Options

- Simple localStorage persistence per branch (tried, deleted)
- Git-like repository layer with object store and ref store
- Server-side database with API
- IndexedDB with custom branching logic

## Decision Outcome

Chosen option: "Git-like repository layer", directly modeled after git's object model. The implementation provides:

- `ObjectStore` and `RefStore` interfaces abstracting storage
- `Commit` objects with parent hash, event snapshot, timestamp, and message
- `Ref` objects pointing to commit hashes
- Operations: `commit()`, `checkout()`, `log()`, `fork()`, `diff()`, `merge()`
- LCA (Lowest Common Ancestor) based three-way diff
- Merge strategies: `ours`, `theirs`, `manual`
- Two backend implementations: memory (for Storybook/tests) and localStorage

### Positive Consequences

- Full commit history is preserved -- can walk the DAG
- Branching and merging are first-class operations
- Memory backend makes stories/tests fast and isolated
- Same interface could back a server-side implementation later

### Negative Consequences

- Significant complexity for a client-side component library
- localStorage has size limits (~5MB) which could be hit with many commits
- Debounced auto-commit (300ms) is needed to avoid one commit per keystroke
