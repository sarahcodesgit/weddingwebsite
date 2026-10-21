# Sarah & Jesus Wedding Website — Implementation Plan

## Product approach

Build a single-page React + Vite wedding invitation site in the empty `sarahcodesgit/weddingwebsite` repository. The site will be entirely static for Hostinger deployment and will use no server, database, guest list, invitation codes, or credentials. The RSVP experience will be a polished, client-only prototype that uses clearly labeled sample UI states and makes no claim that a response has been saved. A future secure RSVP service will validate invitations and save responses only on the server.

The correct Church of the Annunciation at 1618 Texas Avenue will be shown with a temporary, local hero asset sourced from the Wikimedia Commons image “Annunciation Church Houston Texas” by Ed Uthman (CC BY 3.0). The image will include a visible credit and will be isolated in one configuration object so it can be replaced with engagement photography later without layout changes.

The production build will be a Vite `dist` folder. The repository will contain a detailed `README.md`, `.gitignore`, `public/manus-routes.json`, `robots.txt`, `sitemap.xml`, app configuration, and static SEO/Open Graph metadata. The site will use a real Google Maps directions link and a configurable registry URL constant rather than invented venue or registry details.

## Design direction

**Design movement:** Vintage romantic luxury with editorial restraint, modeled after an heirloom invitation suite rather than a generic wedding template.

**Core principles:** The page will privilege atmosphere over density, combine structured editorial typography with hand-finished ornamental details, preserve clear hierarchy and contrast, and use animation only to gently reveal content.

**Color philosophy:** Warm ivory provides paper-like calm; deep olive establishes ceremony and anchors navigation; espresso supplies the reading contrast; muted taupe and mahogany provide antique depth without pink or gloss.

**Layout paradigm:** A letterpress invitation opens into an editorial procession: a full-bleed church portrait framed by an ivory invitation panel, alternating dark-olive and warm-paper “chapters,” and asymmetrical story cards rather than a dashboard-like grid.

**Signature elements:** Fine double-line frame rules, a delicate scallop/eyelet border treatment, and a small S&J seal appear throughout. Botanical corner flourishes are drawn in CSS/SVG-safe ornament rather than relying on unrelated stock imagery.

**Interaction philosophy:** Navigation glides deliberately to each chapter. Accordions, menu controls, RSVP states, and buttons are explicit, keyboard-accessible, and calm. Motion is reduced for visitors who request reduced motion.

**Animation:** A single load-in of the invitation panel, low-distance scroll reveals, and gentle ornament drift are limited to opacity and transform transitions; motion remains optional through `prefers-reduced-motion`.

**Typography system:** Cormorant Garamond anchors display headings, a refined readable sans serif carries body copy, and Cormorant Garamond italic supplies occasional romantic accents. Display scale, letter spacing, and numeric date styling convey hierarchy without sacrificing mobile readability.

**Brand essence:** An intimate heirloom invitation for Sarah and Jesus’s Houston wedding, designed as a lasting keepsake for family and friends. Personality: reverent, romantic, poised.

**Brand voice:** Warm, concise, and sincere. Example: “With gratitude, we invite you into this new chapter.” Example: “Details will arrive in their time; your place in our hearts is already certain.”

**Wordmark & logo:** An interlaced S&J monogram housed in an antique oval medallion, using text and ornamental lines rather than a generic initials badge.

**Signature brand color:** Deep Annunciation Olive `#262E0E`.

## Project structure

```text
src/
  components/         Reusable navigation, decorative, FAQ, RSVP, countdown, and section components
  data/               Editable wedding content, placeholders, links, FAQs, and localization-ready copy
  App.jsx             Single-page section composition and UI state
  main.jsx            React entry point
  styles.css          Tokens, responsive layouts, ornament, components, and animations
public/
  images/             Church hero image and image placeholders
  manus-routes.json   Declares the single public route
  robots.txt          Crawl policy
  sitemap.xml         Canonical sitemap
index.html            Static SEO, canonical, Open Graph, and font declarations
README.md             Setup, editing, RSVP integration, and Hostinger deployment guidance
```

## Build workflow

1. Initialize a clean Vite React application with pinned npm metadata and a static-only build.
2. Add project documentation, source-control ignores, static route/SEO files, and a content/config layer for dates, venue placeholders, images, registry link, and future Portuguese strings.
3. Implement the complete invitation sequence: sticky nav; hero and countdown; ceremony/reception; editorial love story; FAQ/travel; RSVP prototype; registry; footer.
4. Add responsive CSS, reduced-motion support, accessible dialog/menu/accordion/form behavior, and a polished pending/confirmation RSVP interface without data persistence.
5. Add the cited church photo, image credit, Google Maps direction link, and transparent replacement instructions.
6. Run diagnostics, `npm install`, `npm run build`, verify the static route manifest and key responsive layouts in Preview, and correct confirmed issues.
7. Create a feature branch, commit all project files, push it to `sarahcodesgit/weddingwebsite`, and open a pull request into `main`. No production deployment or domain update will be performed.
