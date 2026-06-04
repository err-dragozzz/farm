# FarmLedger Deployment Guide

## 1. Provision Infrastructure

- PostgreSQL: Neon or Supabase.
- Object storage: Cloudinary.
- Weather: OpenWeather API.
- Auth: Google OAuth app.
- Hosting: Vercel.

## 2. Configure Environment Variables

Copy [.env.example](./.env.example) into the Vercel environment settings and set production values.

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## 3. Database Migration

Run once from a secure workstation or CI runner:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
```

Optional seed for staging:

```bash
npm run prisma:seed
```

## 4. Vercel Settings

- Framework preset: Next.js
- Build command: `npm run build`
- Output: managed by Next.js
- Node.js: current Vercel LTS

## 5. Launch Checklist

- Confirm `/login`, `/signup`, and Google auth.
- Confirm protected dashboard redirect behavior.
- Create a farm, crop, expense, and income record.
- Export CSV and PDF reports.
- Upload a small image through Cloudinary.
- Confirm admin account can access `/admin`.
- Run Lighthouse PWA check on the production URL.
