# ShoTech Solutions

Full-stack company website + custom admin CMS built with **Next.js 16, React, TypeScript, Turso/libSQL and Cloudinary**.

## Database initialization

Database schema creation, migrations and one-time backfills are kept out of runtime requests. Run the explicit initializer whenever setting up a new database or applying schema changes:

```bash
npm install
npm run db:init
```

The initializer is idempotent and safely handles existing columns/data. Runtime requests only open the database client and execute their queries.

## Local development

```bash
npm install
cp .env.example .env.local
npm run db:init
npm run dev
```

If `TURSO_DATABASE_URL` is not set locally, the app uses `file:local.db`.

## Vercel + Turso

1. Create a Turso database.
2. Run `npm run db:init` against that database before the first production request (or whenever schema migrations are introduced).
3. In Vercel → Project → Settings → Environment Variables add:

```text
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
JWT_SECRET=<long-random-secret>
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD_HASH=<generated-scrypt-hash>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`ADMIN_PASSWORD_HASH` is preferred. Generate one with:

```bash
npm run auth:hash -- "your-password"
```

4. Redeploy.

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

## Project image gallery

From **Admin → Projects**, you can select multiple images in one upload. Images are uploaded to Cloudinary and stored as the project's gallery. You can:

- upload up to 10 images at once
- upload more images later while editing
- choose any image as the cover
- change image order
- remove an image before saving
- show the complete gallery on the public project details page

The first image becomes the cover automatically unless you select another image.
