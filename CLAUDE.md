# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

There are no tests in this project.

## Architecture

This is a single-page birthday party invitation app built with React 19, TypeScript, and Vite. The entire UI lives in two files: `src/App.tsx` (logic + JSX) and `src/App.scss` (styles), plus global styles in `src/index.scss`.

**Scroll-driven animation model:** The app uses a "fake scroll" pattern — a tall `.scroll-track` div (300vh) creates scrollable height while the actual visual layer is `position: fixed`. Scroll progress (0–1) drives all animations via inline styles in React: the 3D door opening (`rotateY`), camera zoom-through effect, invitation card fade-in, and background music volume.

**Layering (z-index):**
- `z-index: 1` — invitation content (behind door initially)
- `z-index: 10` — room scene with 3D door

**i18n:** Language is auto-detected from the browser via `i18next-browser-languagedetector` (navigator order only, no caching). Fallback is Spanish (`es`). Translation files are at `src/i18n/en.json` and `src/i18n/es.json`. The i18n config must be imported before `<App />` renders (done in `src/main.tsx`).

**CSS variables** (defined in `src/index.scss`): All colors, fonts, and transitions use CSS custom properties (`--color-blue`, `--font-heading`, etc.). The two fonts (Baloo 2, Fredoka) are loaded externally.

**Audio:** Background music (`src/assets/*.mp3`) is controlled via a hidden `<audio>` ref. Volume fades in with scroll progress (0 → 0.5 max). Browser autoplay restrictions are handled silently — audio unlocks on first door click.

**Event details** are hardcoded in `src/App.tsx`: April 23, 2026, 2–5 PM EDT (`UTC-4`). Times are converted to the user's local timezone via `Intl.DateTimeFormat`.
