# ShoTech Solutions

Full-stack company website + custom admin CMS built with **Next.js 16, React, TypeScript, Turso/libSQL and Cloudinary**.

## Important: database initialization
The application now automatically creates its required tables on the first database request using `CREATE TABLE IF NOT EXISTS`. This fixes the Vercel error:

`SQLite error: no such table: services/projects`

You can also initialize manually:

```bash
npm install
npm run db:init
```

## Local development

```bash
npm install
cp .env.example .env.local
npm run db:init
npm run dev
```

If `TURSO_DATABASE_URL` is not set locally, the app uses `file:local.db` and creates the tables automatically.

## Vercel + Turso

1. Create a Turso database.
2. In Vercel → Project → Settings → Environment Variables add:

```text
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
JWT_SECRET=<long-random-secret>
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD=<strong-password>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

3. Redeploy.
4. Open the site. The database tables are created automatically on the first request.

> On Vercel, a missing `TURSO_DATABASE_URL` intentionally throws a clear configuration error instead of trying to create a local `local.db` file.

## Features
- Public pages: Home, Services, Projects, Project Details, About, Contact
- Dynamic projects and services
- Admin login and protected dashboard
- Project CRUD
- Service CRUD
- Contact messages
- Dynamic settings and SEO fields
- Cloudinary upload endpoint
- Turso/libSQL database

## Build

```bash
npm run build
```
