# Food

- App: [https://nuuuwan.github.io/food](https://nuuuwan.github.io/food)
- [Design Document](DESIGN.md)

## Backend (Vercel)

This project now includes a Node-based Vercel mock backend under `api/`:

- `GET /api/foods` - list food history
- `GET /api/foods/:id` - fetch a food analysis
- `POST /api/foods` - save a food analysis
- `POST /api/analyze` - Gemini-powered photo analysis (with mock fallback + hash cache)

`/api/analyze` now:

- hashes uploaded image bytes (`sha256`)
- stores analysis JSON in Vercel Blob
- stores resized image data in browser `localStorage`
- reuses cached analysis for duplicate image uploads (same hash)

`FoodAPIClient` calls these endpoints over HTTP.

### Local development

Run frontend and backend in separate terminals:

1. Frontend: `npm start`
2. Backend: `npm run start:backend`

Use these frontend variables to choose backend target:

- `REACT_APP_VERCEL_TARGET=local` or `remote`
- `REACT_APP_LOCAL_API_BASE_URL=http://localhost:3001`
- `REACT_APP_REMOTE_API_BASE_URL=https://<your-project>.vercel.app`

Optional override (takes highest priority):

- `REACT_APP_API_BASE_URL=<any-api-base-url>`

Examples for `.env.local`:

- Local backend:
  - `REACT_APP_VERCEL_TARGET=local`
  - `REACT_APP_LOCAL_API_BASE_URL=http://localhost:3001`
- Deployed backend:
  - `REACT_APP_VERCEL_TARGET=remote`
  - `REACT_APP_REMOTE_API_BASE_URL=https://<your-project>.vercel.app`

### Gemini setup

Set these environment variables for the backend:

- `GEMINI_API_KEY=your_api_key`
- `GEMINI_MODEL=gemini-2.0-flash` (optional)
- `BLOB_READ_WRITE_TOKEN=...` (required for local `vercel dev`; managed automatically in deployed Vercel when Blob is attached)

For local development with `vercel dev`, add them in `.env.local` at repo root.
