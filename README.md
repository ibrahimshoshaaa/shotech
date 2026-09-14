# ShoTech Solutions

Production-oriented full-stack company website and custom CMS built with **Next.js 16 + React + TypeScript + Turso/libSQL + Cloudinary**.

## Features
- Public website: Home, Services, Projects, Project Details, About, Contact
- Dynamic content — no hardcoded portfolio data required
- Admin dashboard with protected routes
- Project CRUD: title, slug, content, category, technologies, links, status, featured
- Service CRUD
- Contact inbox: read/delete
- Dynamic company + SEO settings
- Cloudinary image upload endpoint
- Turso/libSQL schema included
- Responsive dark ShoTech UI

## Setup
```bash
npm install
cp .env.example .env.local
```
Fill `.env.local`.

### Initialize database
Run `scripts/schema.sql` in your Turso database. For local development the app uses `file:local.db` when `TURSO_DATABASE_URL` is absent; initialize that database with the same schema.

```bash
npm run dev
```
Open `http://localhost:3000`.
Admin login is `/admin/login`.

## Production checklist
1. Create Turso database and run schema.
2. Create Cloudinary account and add credentials.
3. Set a strong `JWT_SECRET`.
4. Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD`.
5. Add all variables to Vercel.
6. Deploy to Vercel.

## Git
```bash
git init
git add .
git commit -m "Initial ShoTech Solutions release"
```
Then connect your GitHub repository and push.
