# Images

This template ships **without personal images** so it stays generic. The HTML
still references the paths below — drop your own files in at these exact names
and they'll appear automatically. Everything degrades gracefully until you do
(broken-image icons in the meantime; no errors).

| File | Used by | Recommended size | Notes |
|------|---------|------------------|-------|
| `profile.webp` | Hero photo (`index.html`) | ~1024 × 1536 (portrait) | Your main photo; `.webp` keeps it light. |
| `portrait.webp` | About section illustration | ~640 × 640 (square) | Can be a photo or illustrated avatar. |
| `og-card.jpg` | Social share preview (Open Graph / Twitter) | 1200 × 630 | Referenced as an absolute URL in the meta tags — update the domain too. |
| `apple-touch-icon.png` | iOS home-screen icon | 180 × 180 | Optional but nice to have. |

## Already included

- **`red-texture.webp`** — a generic background texture used by the crimson
  hero/skill sections. Keep it, or swap for your own texture.
- **`../favicon.svg`** — a neutral "JD" monogram. Edit the text and colours in
  the SVG to your own initials/brand.

## Tips

- Prefer `.webp` for photos (smaller than `.png`/`.jpg` at similar quality).
- Keep the aspect ratios close to the `width`/`height` attributes in the HTML
  to avoid layout shift.
- If you change a filename, update the matching `src="..."` in the HTML.
