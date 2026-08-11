# ledgersocial

LedgerSocial is a social network for crypto traders — follow top traders, copy their trades, stake for yield, and track cumulative returns in one feed. Trading talk becomes trading action.

## Quick summary
A small client-side prototype built with React + Vite demonstrating core UIs for a crypto social / copy‑trading product: feed, copy trading, staking, invest pools, drops, referrals, and a simulated wallet. The app uses in-memory/sample data and a simple storage abstraction (window.storage) that is stubbed to use localStorage for local development.

## Stack
- Language: JavaScript (React)
- Framework / runtime: React 18 + Vite
- Notable libraries: lucide-react (icons), recharts (charts)

## Run locally
1. Install dependencies

```bash
npm install
```

2. Start dev server (Vite)

```bash
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

3. Build for production

```bash
npm run build
npm run preview
```

## Notes for developers
- The UI and demo data live in `src/App.jsx` (large single-file prototype). `src/main.jsx` bootstraps the app and provides a `window.storage` stub backed by `localStorage` so the demo can persist state locally during development.

  - If you integrate a real backend, replace or augment the `window.storage` implementation in `src/main.jsx` with calls to your API (or initialize `window.storage` before mounting the app). See the comment in `src/main.jsx` for context.

- The app is intentionally client-side and simulated; no real funds or network connections are used.

## Suggested next changes (I can make these)
- Split `src/App.jsx` into smaller components (Feed, Wallet, CopyTrading, etc.) to improve maintainability.
- Add a basic GitHub Actions workflow to run `npm run build` on push/PR.
- Add unit/visual tests (Vitest / Playwright) for UI regression coverage.

If you want, I can implement any of the suggestions above — tell me which and I'll create a branch and PR with the changes.
