# Supabase implementation references

The RSVP design and setup instructions use these official sources, verified October 21, 2026:

- [API keys](https://supabase.com/docs/guides/getting-started/api-keys): Browser applications may use only a publishable key; secret/service-role keys bypass RLS and must never appear in a browser bundle or source control. Supabase recommends the current `sb_publishable_...` and `sb_secret_...` key model rather than legacy anon/service-role keys.
- [Environment variables for Edge Functions](https://supabase.com/docs/guides/functions/secrets): Edge Functions receive Supabase-managed environment values. Project-specific secrets should be configured in the Supabase Dashboard or CLI and excluded from Git; the function runtime reads them via `Deno.env.get`.
- [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth): Public functions must deliberately use public/no-auth handling and defend their own inputs; admin operations should require a user JWT. The application will additionally check the authenticated user against a `wedding_admins` allowlist before privileged RSVP operations.
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): Protected tables require RLS, minimal grants, and policy tests. The RSVP migration revokes all `anon` and `authenticated` table access, leaving write and admin operations in Edge Functions only.

These references describe the planned backend. The repository remains in demo mode until credentials, SMS/phone verification, migrations, and Edge Functions are configured and tested against a real Supabase project.
