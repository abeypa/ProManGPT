# Cloudflare Pages Deployment

Use the Next.js app as the Cloudflare Pages project source.

Build settings:

```bash
npm install
npm run build
```

Environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

After deployment, add the Cloudflare Pages domain to Supabase Auth redirect/site URLs.

For Cloudflare-specific runtime support, add the official OpenNext Cloudflare adapter before production hardening if the target Pages runtime requires edge/server functions.
