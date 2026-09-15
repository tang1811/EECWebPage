# Promotion artwork

Place the college's promotion images in `public/assets/promotions/` (for example, `new-student.webp`).
Edit `src/data/promotion-data.ts` and set the matching entry's `image` to
`/assets/promotions/new-student.webp`. That one image appears on the homepage,
news listing, and article; the article image opens at full size. Poster artwork
uses `object-fit: contain` so its text is not cropped.

Until an image is supplied, `PromotionArtwork.astro` displays an illustrated
preview using existing college photographs and a visible sample-image caption.
Real promotion images replace that entire composition, including its overlay.

The two current entries are visual examples with no confirmed offer or deadline.
Update the title, excerpt, body, audience, and period label with approved details,
then set `promotion.isExample` to `false`. Example detail pages are noindex and
excluded from the sitemap. `promotion.showOnHomepage` controls the homepage slot
(maximum two entries). The regular news listing retains both entries.

This prototype uses the local data file; there is no promotion upload form or
automatic scheduling in the CMS yet. Changes require an Astro rebuild/publish.
If the existing CMS exports an article with the same slug, that article replaces
the local entry, including its optional promotion metadata.
