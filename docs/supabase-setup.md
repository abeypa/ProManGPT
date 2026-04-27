# Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Optionally run `supabase/seed.sql` to create the standard engineering teams.
4. Create users from Supabase Auth or invite them from the dashboard.
5. Set the first admin manually:

```sql
update profiles
set role = 'admin'
where id = '<user uuid>';
```

6. Add values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

7. In Authentication > URL Configuration, add:
   - Local site URL: `http://localhost:3000`
   - Cloudflare production URL after deployment

8. Storage bucket `project-files` is created by the schema. Keep it private.

## Notes

- All application tables have RLS enabled.
- Project visibility is private by membership: admins, assigned project managers, assigned team members/leads, and directly assigned task users can access related project records.
- File metadata is stored in `files`; binary objects go to Supabase Storage under the `project-files` bucket.
