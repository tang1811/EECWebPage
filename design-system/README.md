# EEC Website — Design System (Claude Design seed)

Local mirror of the EEC Engineer Laemchabang **website** visual language,
kept in sync with the claude.ai/design project **"EEC Website Design System"**
via DesignSync. (The separate "Design System" project belongs to the
StudentCare Blazor app — do not mix the two.)

## What this is
- `tokens.css` — the single source of truth, copied **verbatim** from
  `web-astro/src/styles/styles.css` (`:root` block). Single light theme;
  dark "cinematic" pages restyle locally and are not token-switched.
- `foundations/` — colour, typography, spacing/radius/shadow cards.
- `components/` — core UI components rendered with the real site CSS
  (buttons/eyebrow from `styles.css`, chips/course cards from
  `homepage.css`, form fields from `subpages.css`).

Each `*.html` starts with a `<!-- @dsCard group="…" -->` marker so it shows
up as a card in the Claude Design "Design System" pane; `_ds_manifest.json`
indexes the cards and tokens.

## Workflow
1. **Seed (done by Claude Code):** these files are pushed up to the Claude
   Design project so the web design surface starts from the real theme.
2. **Design on the web:** open the project at claude.ai/design and design
   new pages/sections on top of these tokens/components.
3. **Sync down:** pull new components back into this folder, one at a time.
4. **Port to Astro:** translate each synced component into `web-astro/`
   (`src/components/*.astro` + the matching stylesheet), then build and
   deploy to the IIS share as usual.

## Editing rule
Never hand-edit token values here in isolation — change them in
`web-astro/src/styles/styles.css` first, then mirror into `tokens.css`,
so the website stays the source of truth.
