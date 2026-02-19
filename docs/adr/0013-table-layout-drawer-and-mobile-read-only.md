# Fixed-Width Columns, Drawer UI, and Mobile Read-Only

- Status: accepted
- Deciders: eitah
- Date: 2026-02-19

Technical Story: `3a59b08` (column widths), `70de234` (cell detail drawer, #10), `18aaf4e` (mobile read-only)

## Context and Problem Statement

The Pugh Matrix table needed a stable, scannable layout across screen sizes. Three related UI problems emerged: columns shifted unpredictably as content changed, the cell HoverCard and modal overlay were awkward on small screens, and inline editing controls (tiny inputs, hover interactions) were unusable on touch devices. How should the table layout, cell detail interaction, and mobile experience be handled?

## Decision Drivers

- Table must remain visually balanced regardless of content length
- Cell details need room for score history timeline and threaded comments
- Touch devices lack hover, making hover-triggered interactions impossible
- Pragmatism over ambition: ship a good read experience on mobile rather than a broken edit experience

## Considered Options

### Column layout

- Auto-width columns (browser default)
- `<colgroup>` with explicit column widths
- CSS width tricks: `1px`/`1%` to constrain and equalize

### Cell detail interaction

- HoverCard + separate detail modal (prior approach, broken on mobile)
- Inline expansion (accordion-style)
- Right-side drawer (Radix Dialog with fixed positioning)
- Bottom sheet for mobile

### Mobile editing

- Full mobile editing support with touch-optimized controls
- Separate mobile-optimized UI
- Auto-detect touch devices and force read-only

## Decision Outcome

### Fixed-width columns

Chosen option: "CSS width tricks", because they produce a balanced layout without extra markup. The criterion column uses `width: 1px` to shrink-to-fit, rating columns use `width: 1%` with `min-width: 90px` to distribute equally, weights are pinned at `72px`, and the add-column button at `48px`.

### Drawer instead of modal

Chosen option: "Right-side drawer", because it keeps the table visible for context, provides enough vertical space for history and comments, and works on both desktop and mobile. Implemented as a Radix `Dialog.Root` with CSS `position: fixed; right: 0` and a `slide-in-right` animation. Width is `380px` capped at `90vw`.

### Mobile read-only

Chosen option: "Auto-detect touch devices and force read-only", because the inline editing UX (small number inputs, hover-triggered interactions, tab navigation between cells) is fundamentally incompatible with touch. Detection uses `window.matchMedia('(pointer: coarse)')` with a change listener, merged into `effectiveReadOnly = readOnly || isMobile`.

### Positive Consequences

- Table columns stay balanced regardless of criterion name length or score count
- Drawer keeps table visible as context while editing a cell
- Mobile users get a clean, scannable read experience instead of broken editing
- `pointer: coarse` detection is more accurate than user-agent sniffing and responds to device changes (e.g., tablet detaching keyboard)

### Negative Consequences

- `width: 1px` / `width: 1%` trick is non-obvious and relies on table layout algorithm behavior
- Drawer requires `!important` overrides on Radix Dialog's default centered positioning
- Mobile users cannot edit at all -- no progressive enhancement path yet
- `pointer: coarse` may misclassify some hybrid devices (e.g., touchscreen laptops)
