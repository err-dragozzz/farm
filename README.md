# FarmLedger

FarmLedger is a production-oriented farm management SaaS built with Next.js App Router, TypeScript, TailwindCSS, Prisma, PostgreSQL, Auth.js, Recharts, Framer Motion, Zustand, React Hook Form, and Zod.

## What Is Included

- Auth: signup, login, logout, Google OAuth, credentials auth, forgot-password request endpoint, JWT sessions, route middleware, and RBAC.
- Core modules: dashboard, farm management, crop lifecycle, expenses, income, reports, notifications, profile, admin, and AI agriculture insights.
- APIs: validated CRUD routes for farms, crops, transactions, notifications, profile, reports, upload, weather, admin, and AI modules.
- Database: complete Prisma PostgreSQL schema with NextAuth tables and seed data.
- Exports: CSV and PDF report downloads.
- PWA: manifest, icon, service worker caching, installable production build.
- Security: bcrypt password hashing, Zod validation, Prisma SQL safety, rate limiting, protected APIs, secure headers, role checks, and upload validation.
- UI: responsive mobile-first dashboard, dark mode, shadcn-style primitives, animated charts, loading/empty states, and premium green SaaS visual system.

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

Seed accounts:

- `farmer@farmledger.app` / `FarmLedger@123`
- `admin@farmledger.app` / `FarmLedger@123`

## Environment

Required:


- `AUTH_SECRET`
- `AUTH_URL`

Recommended production integrations:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `OPENWEATHER_API_KEY`
- Firebase public messaging keys for FCM client integration.

## Database

The Prisma schema lives in [prisma/schema.prisma](./prisma/schema.prisma). It includes:

- `User`
- `Farm`
- `Crop`
- `Transaction`
- `Notification`
- `WeatherData`
- `Account`
- `Session`
- `VerificationToken`

Use Neon or Supabase PostgreSQL for production. Run migrations during deployment with:

```bash
npm run prisma:deploy
```

## Deployment On Vercel

1. Create a PostgreSQL database in Neon or Supabase.
2. Add all environment variables in Vercel Project Settings.
3. Set build command to `npm run build`.
4. Set install command to `npm install`.
5. Add a post-deploy migration step in CI/CD if your workflow supports it:

```bash
npm run prisma:deploy
```

## Architecture

```text
app/            App Router pages and API routes
components/     Shared UI and layout primitives
features/       Module-level client experiences
hooks/          Reusable client hooks
lib/            Auth, Prisma, validation, API guards
services/       Analytics, export, and AI service logic
store/          Zustand state
prisma/         Schema and seed
public/         PWA assets
styles/         Tailwind globals
types/          Shared TypeScript contracts
```

## AI Integration

The AI endpoints are provider-ready:

- `/api/ai/crop-recommendation`
- `/api/ai/disease-detection`
- `/api/ai/yield-prediction`
- `/api/ai/expense-optimization`
- `/api/ai/insights`

They currently return deterministic rules-engine recommendations and expose a clean service boundary in [services/ai.ts](./services/ai.ts) for future OpenAI integration.

## Production Notes

- Add a transactional email provider before sending real password reset links.
- Configure Cloudinary for durable bill/avatar/farm image uploads.
- Configure OpenWeather for live weather data.
- Add Firebase service worker messaging payload handling when FCM credentials are connected.
- Add observability such as Sentry and request logging before high-volume launch.
"# farm" 
"# hello" 
