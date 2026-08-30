# Login Hold Page Overrides

> **PROJECT:** MBTI Z
> **Generated:** 2026-06-05 16:38:17
> **Page Type:** Settings / Profile

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Intro (Vertical), 2. The Journey (Horizontal Track), 3. Detail Reveal, 4. Vertical Footer

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Continuous palette transition. Chapter colors. Progress bar #000000.

### Component Overrides

- Avoid: No feedback after submit
- Avoid: No feedback during loading

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Expo.out Bezier(0.16,1,0.3,1) easing; spring modals (damping:20 stiffness:90); haptic-linked press (Impact Light/Medium); animated ambient light blobs (Reanimated translateX/Y slow oscillation); BlurView glassmorphism headers/nav (intensity 20); scale press 0.97 → 1.0; avoid pure #000000 (OLED smear)
- Forms: Show loading then success/error state
- Feedback: Show spinner/skeleton for operations > 300ms
- CTA Placement: Floating Sticky CTA or End of Horizontal Track
