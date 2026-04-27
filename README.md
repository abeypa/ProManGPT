# EngFlow Project Management

Full-stack project management MVP for an engineering company using Next.js, React, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase Auth, Supabase PostgreSQL, Supabase Storage, and Supabase Realtime-ready tables.

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with Supabase project values before using authenticated routes.

## Supabase

Run the schema in `supabase/schema.sql`, then optionally run `supabase/seed.sql`.

See `docs/supabase-setup.md` for setup details and admin bootstrap instructions.

## Cloudflare Pages

See `docs/cloudflare-pages.md` for build settings and environment variables.

## Included Modules

- Auth and protected app shell
- Dashboard
- Projects and project detail
- Teams
- Stages
- Tasks with list and Kanban views
- Discussions
- Parts / BOM approval tracking
- Vendors and vendor updates
- Supabase Storage file upload
- Notifications and activity logs
- User and role settings
