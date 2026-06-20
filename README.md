# Veridion

A simulated crypto-trading sandbox: React/Vite/TypeScript frontend and a Node/Express/TypeScript backend backed by PostgreSQL.

## Structure

- `frontend/` — React + Vite + Tailwind UI
- `backend/` — Express + Prisma + PostgreSQL API (auth, portfolio/trading, security center, support tickets)

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env        # edit JWT secrets if you like
docker compose up -d db     # starts Postgres only (omit `db` to also build/run the backend in Docker)
npm install
npm run prisma:migrate      # creates tables
npm run prisma:seed         # creates demo user@example.com / password123
npm run dev                 # http://localhost:4000
```

Don't have Docker? Point `DATABASE_URL` in `.env` at any reachable Postgres instance (e.g. a free Neon/Supabase project) instead of running `docker compose`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:5173
```

## Production deployment

### Option A — Docker Compose (single host)

```bash
cd backend
docker compose up -d --build
```

This runs Postgres + the API together. Serve `frontend/dist` (after `npm run build`) from any static host or a reverse proxy in front of the same machine, with `VITE_API_URL` pointing at the backend's public URL.

### Option B — Split hosting

- **Backend**: deploy `backend/` to any Node host with a Postgres add-on (Render, Railway, Fly.io, etc.). Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `CORS_ORIGIN` (your frontend's URL) as environment variables, then run `npx prisma migrate deploy` once on first deploy.
- **Frontend**: deploy `frontend/` (static `npm run build` output) to Vercel/Netlify/Cloudflare Pages, with `VITE_API_URL` set to the backend's public URL.

Because the backend issues the refresh token as a cross-site cookie in production, the frontend and backend should each be served over HTTPS.

## Notes

- Crypto prices are a simulated random-walk feed (no external market data API). Password reset codes are logged server-side rather than emailed, since no transactional email provider is configured — wire one in `backend/src/modules/auth/auth.service.ts` if real email delivery is needed.
- 2FA uses real per-user TOTP secrets (compatible with any authenticator app), not a hardcoded demo code.
