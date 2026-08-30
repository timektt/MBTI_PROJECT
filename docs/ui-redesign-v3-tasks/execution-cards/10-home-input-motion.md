# Card 10 - Home Pointer, Keyboard, Touch, And Motion

Task IDs: `V3-HOME-003`, `V3-HOME-004`, `V3-HOME-005`
Owner: `Home Experience Agent`
Status: `DONE`
Depends on: Card 09

## Deliverable

เพิ่ม interaction ที่เด่นขึ้นแต่ไม่ทำให้ card/image ทับกัน และให้ pointer, keyboard, touch มีความสามารถเท่าเทียม

## Checklist

- Define hover reveal for code, archetype, and house identity.
- Mirror hover with `focus-visible`.
- Define tap-to-focus/select behavior without requiring hover on touch.
- Constrain scale inside each tile's clipping boundary.
- Use transform and opacity rather than width/height animation.
- Keep essential information visible in the resting state.
- Disable nonessential parallax/reveal under reduced motion.
- Test fast pointer movement and repeated focus changes.

## Acceptance

- Interaction is visually stronger than a color-only hover.
- No tile changes grid dimensions or covers a neighbor.
- Keyboard and touch reveal equivalent information.
- Reduced-motion mode remains polished and complete.

## Evidence

- Hover/focus/tap screenshots or short recordings.
- Layout-shift observation.
- Reduced-motion screenshot.
