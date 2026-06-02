# Buy Me a Coffee — unlock Americas & Africa

Profile: [buymeacoffee.com/positivwarrior](https://buymeacoffee.com/positivwarrior)

## How it works

1. Player **signs in with Google** in the game.
2. Clicks **The Americas** or **Africa** → copies unlock code `geo:{uid}:americas` or `geo:{uid}:africa`.
3. Pays **$3+** on Buy Me a Coffee and **pastes the code in the message field**.
4. Webhook grants access in Firestore → player clicks **I've paid — refresh**.

Each continent is a **separate** support (no Whole World bundle yet).

## Setup (one-time)

### 1. Firebase service account (for webhook writes)

1. Firebase Console → **Project settings** → **Service accounts**.
2. **Generate new private key** → open the downloaded JSON.
3. Add to `.env.local` (recommended for **Vercel** — no JSON file upload):

   ```env
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
   ```

   Use the `client_email` and `private_key` fields from the JSON. Keep `\n` as two characters in the string (not real line breaks). `project_id` comes from your existing `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.

4. On **Vercel** → Project → **Settings** → **Environment Variables** — add the same two keys for Production (and Preview if needed). Do not paste the whole JSON as one variable unless you use the legacy option below.

   **Legacy (local only):** `FIREBASE_SERVICE_ACCOUNT_JSON=` with the entire JSON minified on one line.

### 2. Firestore rules

Publish `firestore.rules` from the repo (adds `user_entitlements` read-only for owners).

### 3. Buy Me a Coffee webhook

1. [BMC Dashboard](https://studio.buymeacoffee.com) → your page → **Webhooks** (or API settings).
2. Create webhook URL: `https://YOUR-DOMAIN.com/api/webhooks/buymeacoffee`
3. Copy the **webhook secret** → `.env.local`:

   ```env
   BMC_WEBHOOK_SECRET=your_secret_here
   BMC_MIN_SUPPORT_USD=3
   ```

4. Enable events for new supports / payments.

### 4. Optional: dedicated Extras (cleaner than message codes)

Create two **Extras** on BMC:

- "Unlock The Americas"
- "Unlock Africa"

Set env URLs:

```env
NEXT_PUBLIC_BMC_AMERICAS_URL=https://buymeacoffee.com/positivwarrior/extras/...
NEXT_PUBLIC_BMC_AFRICA_URL=https://buymeacoffee.com/positivwarrior/extras/...
BMC_EXTRA_ID_AMERICAS=123
BMC_EXTRA_ID_AFRICA=456
```

The webhook also matches extras by title containing "America" / "Africa".

## Local testing

Webhook needs a public URL. Use [ngrok](https://ngrok.com/) or deploy preview:

```bash
ngrok http 9002
# Point BMC webhook to https://xxxx.ngrok.io/api/webhooks/buymeacoffee
```

## Security

- Webhook verifies `x-signature-sha256` with `BMC_WEBHOOK_SECRET`.
- Minimum amount `BMC_MIN_SUPPORT_USD` (default 3).
- Unlock code must include Firebase `uid` from signed-in user.
