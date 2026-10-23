# Sarah & Jesus — Wedding 2027

A static React + Vite wedding invitation for **Sarah & Jesus**, celebrating their marriage in Houston, Texas, on **November 27, 2027**. The public website is designed for Hostinger static hosting; its future RSVP backend is designed for Supabase Edge Functions.

## Run locally

Use Node.js 22+ and npm 10+.

```bash
npm install
npm run dev
```

The development site runs on port `3000`. Create the Hostinger-ready production build with:

```bash
npm run build
```

Vite writes `index.html`, `admin.html`, assets, images, and crawler files to `dist/`.

## Edit wedding details

The primary content file is `src/data/weddingData.js`. Update the date, ceremony information, Google Maps URL, registry URL, FAQs, temporary text, image paths, and localization-ready labels there. The `storyChapters` values are deliberate placeholders: replace them only with approved personal stories and photographs.

The temporary hero image is configured in `weddingDetails.hero.image`. To replace it with engagement photography, add a new optimized image under `public/images/`, update `src`, `alt`, and credit information in `src/data/weddingData.js`, then remove or revise `public/images/ATTRIBUTION.md` as appropriate. The hero and ceremony layouts will not need to change.

## Visual system and opening invitation

The public site and private admin dashboard use the same refined palette: dark olive `#4B4D39`, cream `#EDE6D4`, espresso `#402116`, and muted taupe `#A6998A`. Shared public styles live in `src/styles.css`; dashboard styles live in `src/admin.css`.

`public/images/lace-texture.svg` is a lightweight transparent floral-lace pattern. It is intentionally applied only behind the espresso introduction and FAQ sections at 7.5% opacity. Keep it behind content and do not expand it across every section without checking contrast.

`src/components/OpeningInvitation.jsx` renders the optional first-visit vintage envelope. It uses layered React, CSS, and local SVG artwork: an engraved ivory envelope with an ornamental S&amp;J wax seal, a softly scalloped flap, and a botanical lining. The envelope is the sole opening control; its understated “Click to open” cue is informational. Clicking it lifts the flap, briefly reveals the lining, and fades the complete overlay directly into the already-rendered homepage in approximately 1.25 seconds—no separate invitation card or miniature page appears. “Skip to the website” bypasses it immediately. A `sessionStorage` flag suppresses the opening after either action for the remainder of that browser session. The overlay is enabled only after JavaScript loads, so the prerendered homepage remains directly accessible to crawlers and no-script visitors. Reduced-motion visitors receive an immediate transition, and no audio is used.

## RSVP status: interactive demo mode

The public RSVP section now collects a primary guest’s full name and phone number, attendance response, optional household-member/additional-guest names, and optional dietary or special-request notes. It calculates the total attending and supports an in-session “Update this demo RSVP” return path.

**The website currently runs in demo mode.** A demo submission shows a clearly labeled summary in the current browser session only. It is not sent, saved, looked up, texted, or available to the hosts. This is intentional: no Supabase project or SMS/phone verification workflow has been configured or tested for this repository.

Demo mode is the safe default when `VITE_RSVP_MODE` is absent or set to `demo`. Do not set it to `live` until all setup, security review, and real-project tests below are complete.

## Supabase architecture prepared in this repository

The implementation is ready for a future Supabase project but has **not** been deployed or tested against one.

- `supabase/migrations/20261021180000_wedding_rsvp.sql` creates protected RSVP responses, household-member records, rate-limit records, and an admin allowlist. It enables RLS and revokes all direct `anon` and `authenticated` table access.
- `src/components/RsvpForm.jsx` includes the future live-only Supabase phone OTP flow: it requests and verifies a Supabase Auth SMS code before it calls the submission endpoint. This path is present for later configuration but is deliberately untested and inactive while demo mode is enabled.
- `supabase/functions/rsvp-submit/` contains the future phone-authenticated submission endpoint. It validates guest fields, enforces the eight-person limit, applies a hashed trusted-platform-IP rate limit, rejects honeypot/timing spam signals, and requires a verified Supabase Auth phone claim that matches the form phone number.
- `supabase/functions/rsvp-admin/` contains the private admin endpoint. It requires a valid Supabase user JWT and separately checks the user ID against `wedding_admins` before listing, editing, deleting, or exporting RSVP records.
- `admin.html` is a separate noindex page. Once configured, it uses Supabase Auth email/password sign-in, shows submissions, household members, phone numbers, totals, edit/delete controls, and an authorized CSV export.
- `docs/SUPABASE-SOURCES.md` records the official Supabase security references used for this design.

Browser code uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. A Supabase secret/service-role key, database password, SMS credential, rate-limit salt, or administrator password must never be placed in React code, `.env.example`, public files, Git history, or Hostinger.

## Future Supabase + SMS enablement checklist

Do this only when you are ready to connect and test the backend. It is not part of the current deployment.

1. Create a Supabase project and install the Supabase CLI on a trusted local machine.
2. Copy `.env.example` to an ignored local `.env.local`, add the project URL and **publishable** key, and keep `VITE_RSVP_MODE=demo` while testing the UI.
3. Link the project and apply the migration:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

4. Configure Supabase Auth phone sign-in with an approved SMS provider. The repository includes a live-only OTP flow, but do not enable live RSVP until it has been tested end-to-end with that provider.
5. In Supabase Edge Function Secrets, configure the values from `supabase/functions/.env.example`. Use an origin allowlist such as `https://sarahandjesus2027.com` (plus your exact trusted development origin during testing), generate a strong random `RSVP_RATE_LIMIT_SALT`, and set `RSVP_SMS_VERIFICATION_ENABLED=true` only after SMS testing succeeds.
6. Deploy the functions from a trusted machine:

   ```bash
   supabase functions deploy rsvp-submit
   supabase functions deploy rsvp-admin
   ```

7. Create the initial administrator through the Supabase Auth Dashboard, then insert that user’s Auth UUID into the allowlist in the SQL Editor:

   ```sql
   insert into public.wedding_admins (user_id)
   values ('AUTH_USER_UUID_HERE');
   ```

8. Set `VITE_RSVP_MODE=live` only after verifying: phone OTP identity, a new RSVP, a returning guest update using the same verified phone, decline behavior, rate limiting, an unauthorized admin denial, authorized admin edit/delete, and CSV export. Run the RLS test with `supabase test db` when a local Supabase environment is available.

Until every step above has passed with a real project, keep demo mode active and do not describe the RSVP system as live or persistent.

## English and Portuguese

`src/data/weddingData.js` includes a `localeLabels` structure with English and Portuguese example UI strings. When full Portuguese translation is approved, move all visitor-facing copy into complete `en` and `pt` objects and expose an accessible language switcher. Do not enable a partial translation toggle.

## Temporary church image

The hero asset depicts the correct Church of the Annunciation at 1618 Texas Avenue in Downtown Houston. It is a resized WebP adaptation of **“Annunciation Church Houston Texas”** by **Ed Uthman**, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Annunciation_Church_Houston_Texas.JPG). The full required credit appears in `public/images/ATTRIBUTION.md` and is displayed from the hero image.

## Deploy to Hostinger

No deployment is performed by this workflow. When the public site is ready for a separately approved launch:

1. Run `npm install` and `npm run build` locally or in CI.
2. In Hostinger hPanel, open **File Manager** for `sarahandjesus2027.com`.
3. Open the domain’s `public_html` directory.
4. Upload the **contents** of `dist/` into `public_html` (not the `dist` folder itself).
5. Confirm that `index.html`, `admin.html`, `assets/`, `images/`, `robots.txt`, `sitemap.xml`, and `manus-routes.json` are present at the site root.
6. Test desktop/mobile navigation, Google Maps, FAQ, registry URL, and the clearly marked RSVP demo. Keep `admin.html` private and do not treat it as protected until Supabase Auth plus the allowlist are live-tested.

## Project files

- `src/App.jsx` — public invitation composition and interaction shell.
- `src/components/OpeningInvitation.jsx` — session-only, motion-safe first-visit envelope.
- `src/opening-invitation.css` — isolated card-free vintage envelope, layered SVG, and responsive 1.25-second opening-to-homepage transition styles.
- `src/components/RsvpForm.jsx` — guest-friendly RSVP form with safe demo mode.
- `src/components/AdminDashboard.jsx` and `src/admin.jsx` — separate private admin interface.
- `src/lib/supabase.js` — browser-safe Supabase client configuration and demo/live guard.
- `supabase/` — migration, Edge Functions, environment template, and RLS tests for later backend enablement.
- `docs/SUPABASE-SOURCES.md` — official security sources used for the integration design.
- `src/data/weddingData.js` — edit-friendly wedding content and configuration.
- `src/styles.css` and `src/admin.css` — responsive public and private visual systems.
- `public/images/lace-texture.svg` — subtle local floral-lace overlay for selected espresso sections.
- `public/images/opening-envelope-lining.svg` — local engraved botanical lining revealed briefly as the first-visit envelope opens.
- `public/` — static image, attribution record, route manifest, robots, sitemap, and favicon.
