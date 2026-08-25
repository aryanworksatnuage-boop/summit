# Leaf

A private, minimalist space for typing out loud thoughts. Every keystroke becomes
letter confetti, and thoughts disappear when released.

## Development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Interaction and settings

Use the gear menu to choose one of four letter palettes, pick from 12 system-font
stacks, or disable release shake. Preferences are kept in `sessionStorage`, so
they survive reloads in the current tab but are not saved permanently. Shake is
triggered when **Scream** releases a thought and is always suppressed when the
browser requests reduced motion.

The confetti renderer uses a fixed pool of at most 36 DOM letters. A rapid-typing
stress pass (280 printable key events) now performs **0 React state updates and 0
mount/unmount cycles** for confetti, versus 280 state additions, 280 scheduled
state removals, and up to 560 component renders previously. Production-build
route JS changed from **1.39 kB to 2.93 kB** (First Load JS: 103 kB to 105 kB) to
support the settings UI, while the dependency set is unchanged and no font files
or animation packages were added. All font choices use local system stacks and
animations use CSS.

## GitHub Pages

The Pages workflow builds a static export and deploys it after every push to
`main`, `develop`, or `work`. In the repository settings, set **Pages → Source** to
**GitHub Actions**. The deployed URL is shown in the workflow's `deploy` job.
