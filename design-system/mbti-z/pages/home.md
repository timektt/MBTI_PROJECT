# MBTI Z V4 Home Page Contract

Status: `ACTIVE`
Direction: `Living Archive`
Evidence: `output/ui-redesign-v4/2026-08-30/home/`

## Outcome

The Home page must explain what MBTI Z is, start the guest-first assessment, show the layered result model and route users into the 16-Type archive without framing the product around one Type.

## Information Architecture

1. Full-bleed image Hero with the literal `MBTI Z` brand name.
2. Result Anatomy reduced to Type, House and Result Artifact.
3. Four Houses as the entry point to the 16 dedicated Type routes.
4. How it works combined with local My Results continuity and the final action.

Do not restore the interactive four-Type Hero mosaic, five-column anatomy wall, standalone My Results band or a separate final CTA section.

## Hero Rules

- Use `public/mbti-z/v4/home/living-archive-hero-v1.webp` through `next/image`.
- Image is atmospheric and uses empty alt text; DOM copy carries all meaning.
- Keep the architecture center/right and a dark copy-safe region on the left.
- H1 is `MBTI Z`; the value proposition is supporting copy.
- One primary button routes to `/quiz`.
- `/types` is a secondary text link, not a second filled button.
- Show at least 24px of the next section at 320x568, 390x844, 768x1024, 1024x768 and 1440x1000.
- No single Type, House color or Animal may dominate the general Hero.

## Four Houses Rules

- Reuse the four verified House backplates.
- Cards are direct links to `/types?house=<key>`.
- Keep geometry stable; hover/focus may transform the image inside an `overflow-hidden` card only.
- House title and its four Type codes remain visible without hover.
- Radius is 6px and the grid is one column below 420px, two columns on compact/tablet widths and four columns from desktop.

## Responsive And Accessibility

- Required matrix: 320, 390, 768, 1024 and 1440 widths in TH and EN.
- Exactly one `main` and one `h1`.
- No horizontal overflow, target overlap, clipped text or image decode failure.
- All links keep a minimum 44px interactive height where they function as controls.
- Hover behavior must have a keyboard focus equivalent and respect reduced motion.

## Visual Rules

- Base colors: near-black, charcoal, bone and restrained antique gold.
- House colors appear only in House identity assets and accents.
- Use full-width bands and unframed editorial layouts; cards are reserved for the repeated House links.
- Do not add ambient orbs, gradient blobs, floating UI cards, glassmorphism, fake interface imagery or decorative generated art.
