# GeoGuesser

Guess countries on an interactive world map. Timed rounds by continent, personal score history, and optional **global leaderboards** via Firebase Firestore.

## Quick start

```bash
npm install
cp .env.example .env.local   # then add Firebase keys for global leaderboard
npm run dev
```

Open **http://localhost:9002**

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 9002) |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run check:geo` | Validate map ↔ REST Countries matching |

## External setup (Firebase, deploy)

**Start here:** [docs/SETUP.md](docs/SETUP.md) — step-by-step for Firebase, Firestore rules, indexes, Vercel/Firebase hosting, and troubleshooting.

Shorter Firebase reference: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Project structure

```
src/app/          # Next.js pages (home, play, leaderboard)
src/components/   # Game UI, map, dialogs
src/lib/          # Game logic, scores, Firebase, leaderboard
docs/             # Setup guides
```

## Features

- Five regions: Europe, Asia & Oceania, Americas, Africa, Whole World
- Country guessing with translations and demonyms
- Interactive map highlights
- Local score history (`localStorage`)
- Global leaderboard (requires Firebase env vars)

## Environment variables

See [.env.example](.env.example). All Firebase variables are prefixed with `NEXT_PUBLIC_` because the client SDK is used from Next.js server actions.

## License

Private project — adjust as needed.
