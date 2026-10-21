# Family RSVP + Supabase Implementation Plan

## Scope and review workflow

The existing wedding site is currently on `feature/luxury-wedding-site` and is already under review in GitHub PR #1. This update will be committed to that existing feature branch so PR #1 remains the single reviewable website change rather than creating a duplicate pull request against `main`. No production website or Hostinger deployment will be performed.

## Guest RSVP experience

The current invitation-code lookup prototype will be replaced with a simple, family-friendly form. It will collect the primary guest’s full name, phone number, and one required response: **Joyfully Accepts** or **Regretfully Declines**.

For an acceptance, the form will reveal an optional household-member/additional-guest area. Guests can add and remove full-name fields, with an on-screen total that counts the primary guest plus accepted additional guests. The implementation will cap the total at eight people per response as a reasonable abuse and data-integrity limit. It will include an optional dietary restrictions or special-requests field and this required note: “Please include only the family members or additional guests listed on your invitation.”

For a decline, additional-guest and dietary fields will be hidden and cleared before submission. In the default demo mode, submitting the form creates a clearly marked in-session preview summary, and a returning guest can choose “Update this demo RSVP” to revise it. The demo never sends or stores an RSVP. A production confirmation summary will appear only after an authenticated server response. Live returning-guest updates will use normalized name and phone data only after an SMS verification workflow is configured and tested.

## Supabase security architecture

The static React website will use only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the browser. Those public client values will be loaded through environment variables and will never include a service-role key.

Persistent writes, duplicate detection, rate limiting, server-side validation, and administrative operations will run in Supabase Edge Functions. The public `rsvp-submit` function will validate data shape, phone format, and lengths; reject honeypot content and implausibly fast submissions; enforce the eight-person limit; normalize names and phone data for duplicate detection; apply an IP-hash-based rate limit; and use a server-only privileged client to write a response plus its household members. The production enablement checklist includes Supabase phone/SMS OTP verification before returning guests may update an existing response.

SQL migrations will create `rsvp_responses`, `rsvp_additional_guests`, `rsvp_rate_limits`, and `wedding_admins` tables; constraints, indexes, Row Level Security, and narrowly scoped database functions for rate-limit consumption. Direct public table access will remain disabled. Supabase’s service-role key will be available only inside the Edge Function runtime and will never be committed, put in the Vite environment, or rendered to the browser.

## Admin dashboard

A private `admin.html` page will use Supabase Auth email/password login and will be marked `noindex`. The browser will use the authenticated user token to call a server-side `rsvp-admin` Edge Function. That function will check the user against the `wedding_admins` allowlist before it may list, edit, delete, or export responses.

The dashboard will display submissions, phone numbers, household members, response status, dietary/special-request notes, and aggregate attendance total. It will support editing or deleting a response and downloading the authorized response view as CSV. No admin password or credentials will appear in application code.

## Configuration and verification

The repository will include `supabase/migrations`, Edge Function source, `.env.example`, and precise README setup steps for creating a Supabase project, applying migrations, creating an admin Auth user, adding that user to the database allowlist, setting Edge Function secrets, and deploying functions. The website build remains static for Hostinger.

A live persistent RSVP test requires the user’s Supabase project URL, public publishable key, scoped Supabase access token, and a configured SMS provider/phone OTP workflow. Until those are supplied and the migration/functions are exercised against a real project, the website stays in demo mode. The demo is interactive in the current browser session but accurately states that it has not sent or stored an RSVP. The code, migration, and setup files can be completed without those credentials.
