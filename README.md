# Sitting — AI Headshot Generator (MVP)

A working end-to-end AI headshot generator: upload photos → train a
personal LoRA model → generate styled headshots → download.

This is an MVP. Auth and payments are intentionally left out so you can get
the core AI flow working first, then bolt those on.

---

## 1. What's inside

```
app/
  page.tsx              → landing page
  upload/page.tsx        → upload flow + polling UI
  results/page.tsx       → gallery / download page
  api/train/route.ts     → zips photos, starts LoRA training on Replicate
  api/status/route.ts    → polls training status
  api/generate/route.ts  → generates headshots once training succeeds
lib/replicate.ts          → Replicate client + style presets
```

## 2. One-time setup

### a) Install dependencies
```bash
npm install
```

### b) Create a Replicate account + get an API token
1. Sign up at https://replicate.com (free — you get a small amount of trial credit)
2. Go to https://replicate.com/account/api-tokens and copy your token

### c) Create a destination model (one time only)
Training a LoRA pushes a new "version" into a model you own. Create one empty
private model to act as that destination:
1. Go to https://replicate.com/create
2. Name it something like `sitting-lora`, set visibility to Private
3. Note the full slug, e.g. `yourusername/sitting-lora`

### d) Set environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` and fill in:
- `REPLICATE_API_TOKEN`
- `REPLICATE_TRAINING_DESTINATION` (the slug from step c)

## 3. Run it locally
```bash
npm run dev
```
Visit http://localhost:3000

**Note on cost:** every real training run costs a small amount of Replicate
credit (roughly $1–2) and generation costs another ~$1–2. Your free trial
credit covers a handful of full test runs — plenty to validate the app
before spending real money.

## 4. Deploy for free (Vercel)
1. Push this project to a GitHub repo
2. Go to https://vercel.com/new and import the repo
3. Vercel auto-detects Next.js — no config needed
4. Add the same two environment variables (`REPLICATE_API_TOKEN`,
   `REPLICATE_TRAINING_DESTINATION`) in Vercel's project settings →
   Environment Variables
5. Deploy — you'll get a free `yourproject.vercel.app` URL

Training takes 15–25 minutes. Vercel's free tier has a serverless function
timeout, but this app avoids hitting it by polling client-side every 15
seconds rather than holding one request open — no extra config needed.

## 5. What to add next (not included in this MVP)
- **Auth** — Clerk or Supabase Auth (free tier), so results are tied to a user
- **Payments** — Stripe Checkout, charge before triggering `/api/train`
- **Persistence** — currently results only live in the browser's
  `sessionStorage` for the results page; add a database (Supabase free tier)
  to save galleries permanently
- **Photo validation** — check face detection / image quality before upload
  to improve result quality (reduces bad-training complaints)

## 6. Style presets
Edit `lib/replicate.ts` → `STYLE_PRESETS` to change the looks generated
(currently: Corporate, Editorial, Outdoor, Casual). This is plain prompt
engineering — no code changes needed elsewhere to add/remove a style.
