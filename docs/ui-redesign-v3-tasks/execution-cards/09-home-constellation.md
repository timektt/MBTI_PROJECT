# Card 09 - Home Four-House Constellation

Task IDs: `V3-HOME-001`, `V3-HOME-002`
Owner: `Home Experience Agent`
Status: `DONE`
Depends on: Cards 01, 03, and 04

## Deliverable

แทน ESTJ hero เดี่ยวด้วย visual constellation แบบ deterministic ที่แสดงตัวแทน 4 houses พร้อมกัน

## Checklist

- Remove the `profiles.find(...ESTJ)` presentation dependency.
- Use approved representative types for the four houses.
- Define stable desktop and mobile geometry with aspect ratio and bounds.
- Keep product name, value proposition, Quiz CTA, and next-section hint visible.
- Use existing house/type assets where they remain legible.
- Provide meaningful alt text or mark decorative layers appropriately.
- Avoid random initial state and negative layout overlap.

## Acceptance

- First viewport no longer implies MBTI Z equals ESTJ.
- All four houses are recognizable without interaction.
- Hero has stable dimensions before assets load.
- Mobile shows a useful composition rather than a cropped desktop canvas.

## Evidence

- Before/after at 390 and 1440.
- Layout bounds and image-load stability check.
