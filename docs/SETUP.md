# GeoGuesser — external services setup guide

This walkthrough covers every **third-party service** you need to run the app locally and deploy it with a working **global leaderboard**.

---

## Quick checklist

| Service | Required? | Purpose |
|---------|-----------|---------|
| [Firebase](https://console.firebase.google.com/) | **Yes** (for global leaderboard) | Firestore scores |
| [REST Countries API](https://restcountries.com/) | No setup | Country data (public API) |
| [unpkg world-atlas](https://unpkg.com/world-atlas@2/countries-110m.json) | No setup | Map GeoJSON |
| [Vercel](https://vercel.com/) or [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) | For production deploy | Hosting |
| Google AI / Genkit | **No** (optional) | Legacy AI pause flow (disabled in app) |

---

## 1. Local development (no Firebase)

You can play the game without any accounts:

```bash
npm install
npm run dev
```

Open **http://localhost:9002**

- Guessing, map, timer, and **personal scores** (browser `localStorage`) work.
- **Global leaderboard** submit/load will show a clear error until Firebase is configured.

---

## 2. Firebase — global leaderboard

### 2.1 Create a project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name it (e.g. `geoguesser-leaderboard`).
4. Google Analytics: optional.
5. Click **Create project**.

### 2.2 Register the web app

1. On the project overview, click the **Web** icon (`</>`).
2. App nickname: `GeoGuesser Web`.
3. **Do not** need Firebase Hosting for Vercel deploy (optional if you use Firebase App Hosting).
4. Click **Register app**.
5. Copy the `firebaseConfig` object values — you will paste them into `.env.local`.

Example config block from Firebase:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### 2.3 Enable Firestore

1. **Build → Firestore Database**.
2. **Create database**.
3. Choose a region close to your users (e.g. `europe-west1`).
4. Start in **production mode**.
5. **Enable**.

### 2.4 Security rules

1. **Firestore Database → Rules**.
2. Paste and **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll([
        'playerName', 'continentId', 'continentName', 'score', 'total', 'timeTaken', 'timestamp'
      ])
      && request.resource.data.playerName is string
      && request.resource.data.playerName.size() >= 1
      && request.resource.data.playerName.size() <= 20
      && request.resource.data.score is int
      && request.resource.data.total is int
      && request.resource.data.timeTaken is int
      && request.resource.data.timestamp is int;
      allow update, delete: if false;
    }
  }
}
```

These rules allow anyone to **read** and **create** valid score rows (no auth). Good for a hobby leaderboard; add App Check or rate limits before a large public launch.

### 2.5 Composite index

The app queries: `continentId` + `score` desc + `timeTaken` asc.

1. **Firestore → Indexes → Composite**.
2. **Create index**:
   - Collection: `leaderboard`
   - Fields: `continentId` Ascending, `score` Descending, `timeTaken` Ascending
   - Query scope: Collection
3. Wait until status is **Enabled** (a few minutes).

If you skip this, the first leaderboard load may log an error with a **link to auto-create** the index — click that link in the browser console when testing.

### 2.6 Local environment variables

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows (PowerShell): `Copy-Item .env.example .env.local`

2. Fill in from Firebase web app config:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. Restart the dev server:

   ```bash
   npm run dev
   ```

### 2.7 Enable Google Sign-In (Asia & Oceania)

The app uses **Firebase Authentication** with Google. Europe works without signing in.

1. Firebase Console → **Build → Authentication**.
2. Click **Get started** (if first time).
3. **Sign-in method** tab → **Google** → **Enable** → set support email → **Save**.
4. **Settings** → **Authorized domains** — ensure these exist:
   - `localhost` (local dev)
   - Your production domain (e.g. `your-app.vercel.app`) after deploy
5. Restart `npm run dev`, open `/play`, click **Asia & Oceania** → **Continue with Google**.

**Note:** Leaderboard still works without login for **Europe**. Sign-in unlocks Asia & Oceania and prefills your name from Google.

### 2.8 Verify Firebase works

1. Play a game at `/play` until the end dialog appears.
2. Enter a name → **Submit**.
3. Open `/leaderboard` → **Global** tab → refresh.
4. Your score should appear under the matching continent.

**Firebase Console → Firestore → Data** should show a `leaderboard` collection with new documents.

### 2.9 Budget alerts (recommended)

1. **Project settings → Usage and billing**.
2. Set a budget alert (Firestore free tier is generous for small apps).

---

## 3. Deploy to production

### Option A — Vercel (recommended for Next.js)

1. Push the repo to GitHub.
2. [vercel.com](https://vercel.com/) → **Add New Project** → import the repo.
3. Framework preset: **Next.js**.
4. **Environment variables**: add the same six `NEXT_PUBLIC_FIREBASE_*` values as in `.env.local`.
5. Deploy.

After deploy, test submit + leaderboard on the production URL.

### Option B — Firebase App Hosting

This repo includes `apphosting.yaml`. Follow [Firebase App Hosting docs](https://firebase.google.com/docs/app-hosting):

1. Link the GitHub repo in Firebase Console.
2. Set environment variables in the App Hosting backend settings.
3. Deploy from the console.

---

## 4. Optional services

### REST Countries & map CDN

Used at runtime with no API key:

- `https://restcountries.com/v3.1/region/...`
- `https://unpkg.com/world-atlas@2/countries-110m.json`

If either is down, country load or the map may fail — retry later.

### Validate map ↔ country matching

```bash
npm run check:geo
```

Runs offline checks against the same matching logic as the game.

### Genkit / Google AI (not required)

The app uses a simple rule for pause (`challenge mode` off = pause allowed). Genkit remains in the repo for future challenge features.

To experiment later:

1. [Google AI Studio](https://aistudio.google.com/) → create an API key.
2. Add `GOOGLE_GENAI_API_KEY=...` to `.env.local`.
3. Run `npm run genkit:dev`.

---

## 5. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Leaderboard banner “not configured” | Missing or incomplete `.env.local`; restart `npm run dev` |
| Permission denied on submit | Check Firestore rules (section 2.4) |
| Index error in console | Create composite index (section 2.5) |
| Submit succeeds in UI but no data | Wrong `projectId`; check Firebase Console project |
| `npm run build` fails on Windows | Use `npm run build` (uses `cross-env` now) |
| Build: Suspense / useSearchParams | Fixed via `play/page.tsx` + `play-client.tsx` |

---

## 6. What you do **not** need yet

From the original product blueprint (not implemented):

- RevenueCat / IAP
- Firebase Auth
- Cloud Functions for entitlements
- Remote Config
- Achievements sync

The web app ships with **all continents free**. To lock regions later, edit `src/lib/entitlements.ts`.

---

## Next steps after setup

1. Complete the manual test list in `LEADERBOARD_IMPLEMENTATION.md`.
2. Share the production URL.
3. Monitor Firestore usage in Firebase Console.

For a shorter Firebase-only reference, see `FIREBASE_SETUP.md` in the project root.
