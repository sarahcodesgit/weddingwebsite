# Sarah & Jesus — Wedding 2027

A static React + Vite wedding invitation for **Sarah & Jesus**, celebrating their marriage in Houston, Texas, on **November 27, 2027**. The site is designed for deployment to Hostinger and does not require a server or database in this first phase.

## Run locally

Use Node.js 20+ and npm 10+.

```bash
npm install
npm run dev
```

The development site runs on port `3000`. Create an optimized production build with:

```bash
npm run build
```

Vite writes the deployable static site to `dist/`.

## Edit wedding details

The primary content file is `src/data/weddingData.js`. Update the date, ceremony information, Google Maps URL, registry URL, FAQs, temporary text, image paths, and localization-ready labels there. The `storyChapters` values are deliberate placeholders: replace them only with approved personal stories and photographs.

The temporary hero image is configured in `weddingDetails.hero.image`. To replace it with engagement photography, add the new optimized image under `public/images/`, update `src`, `alt`, and credit information in `src/data/weddingData.js`, then remove or revise `public/images/ATTRIBUTION.md` as appropriate. The hero and ceremony layouts will not need to change.

The registry action is intentionally set to `https://example.com/registry`. Replace `registryUrl` with the couple’s final registry URL before sharing the site.

## RSVP: current prototype vs. live service

The RSVP section is a non-persistent frontend prototype. It never looks up an invitation, sends a response, or saves names, dietary information, attendance, or invitation codes. Do not place any real guest data or administrative credentials in source files.

For the live RSVP system, add a secure backend that:

- accepts a name or invitation code over HTTPS and rate-limits lookup attempts;
- verifies the invitation server-side and returns only that household’s invited members and attendance limit;
- keeps invitation codes, guest lists, and administrator access out of the browser bundle;
- validates each attendee against the invited household on submission, prevents uninvited plus-ones, and stores dietary/accessibility notes safely;
- provides an authenticated host-only dashboard for guest/group management, pending replies, attendance totals, and exports; and
- sends a real RSVP confirmation only after a successful server-side save.

The existing `RsvpPrototype` component is intentionally designed around these handoff points without claiming that any response is live.

## English and Portuguese

`src/data/weddingData.js` includes a `localeLabels` structure with English and Portuguese example UI strings. When full Portuguese translation is approved, move all visitor-facing copy into complete `en` and `pt` objects and expose an accessible language switcher. Do not enable a partial translation toggle.

## Temporary church image

The hero asset depicts the correct Church of the Annunciation at 1618 Texas Avenue in Downtown Houston. It is a resized WebP adaptation of **“Annunciation Church Houston Texas”** by **Ed Uthman**, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Annunciation_Church_Houston_Texas.JPG). The full required credit appears in `public/images/ATTRIBUTION.md` and is displayed from the hero image.

## Deploy to Hostinger

1. Run `npm install` and `npm run build` locally or in CI.
2. In Hostinger hPanel, open **File Manager** for `sarahandjesus2027.com`.
3. Open the domain’s `public_html` directory.
4. Upload the **contents** of `dist/` into `public_html` (not the `dist` folder itself).
5. Confirm that `index.html`, `assets/`, `images/`, `robots.txt`, `sitemap.xml`, and `manus-routes.json` are present at the site root.
6. Visit the domain and test desktop/mobile navigation, the Google Maps link, FAQ controls, RSVP prototype notice, and registry URL.

No deployment is performed by this project workflow. Verify the final registry URL, details marked pending, and church-photo attribution before publishing.

## Project files

- `src/App.jsx` — page composition and interaction shell.
- `src/components/` — reusable monogram, countdown, accordion, and RSVP prototype components.
- `src/data/weddingData.js` — edit-friendly content and configuration.
- `src/styles.css` — responsive vintage-editorial visual system and accessibility states.
- `public/` — static image, attribution record, route manifest, robots, sitemap, and favicon.
