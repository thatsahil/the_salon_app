---
name: Serene Salon Systems
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#46464f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777680'
  outline-variant: '#c8c5d0'
  surface-tint: '#585990'
  primary: '#585990'
  on-primary: '#ffffff'
  primary-container: '#8b8cc7'
  on-primary-container: '#232458'
  inverse-primary: '#c1c1ff'
  secondary: '#4c6548'
  on-secondary: '#ffffff'
  secondary-container: '#ceeac5'
  on-secondary-container: '#526b4d'
  tertiary: '#805252'
  on-tertiary: '#ffffff'
  tertiary-container: '#b98383'
  on-tertiary-container: '#441f20'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#141449'
  on-primary-fixed-variant: '#404177'
  secondary-fixed: '#ceeac5'
  secondary-fixed-dim: '#b3ceab'
  on-secondary-fixed: '#0a2009'
  on-secondary-fixed-variant: '#354d31'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#f4b8b8'
  on-tertiary-fixed: '#321113'
  on-tertiary-fixed-variant: '#663b3c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in **Minimalism** with a focus on high-end boutique aesthetics. It is designed for salon owners who value clarity, calm, and efficiency. The interface should feel like a digital extension of a clean, well-lit studio—airy, organized, and welcoming.

The visual narrative prioritizes "negative space as a feature," allowing data and schedules to breathe. By avoiding complex engineering visuals and unnecessary AI abstractions, the design system establishes a trustworthy and professional toolset that feels human and approachable. The emotional goal is to reduce the cognitive load of management, transforming administrative tasks into a seamless, high-contrast experience.

## Colors

The palette uses a "Soft Botanical" approach. The background is a crisp, sterile white to ensure maximum contrast and cleanliness.

- **Primary (Lavender):** Used for primary actions, active navigation states, and brand-defining elements. It conveys a sense of premium service and relaxation.
- **Secondary (Sage):** Employed for success states, confirmed appointments, and growth metrics in reporting.
- **Tertiary (Blush):** Used sparingly for highlighting special client notes or delicate alerts.
- **Neutral:** A refined slate grey used for secondary text and borders, ensuring the UI remains grounded and professional without the harshness of pure black.

## Typography

This design system utilizes **Manrope** across all levels to maintain a modern, geometric, yet highly readable appearance. The typography strategy relies on generous line heights to improve legibility for busy staff viewing tablets or phones at a distance.

Hierarchy is established through weight and scale rather than color. Headlines use a tighter letter-spacing for a "designed" look, while labels and body text are spaced for maximum clarity. All interactive elements must use the `label-md` role to ensure hit areas are visually distinct and readable.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. For mobile and tablet, it uses a fluid grid with 24px side margins. On desktop, the content is centered within a 1200px container to prevent eye strain.

- **The 8px Grid:** All spacing between elements must be a multiple of 8px.
- **Vertical Rhythm:** Use `stack-lg` (32px) to separate distinct sections (e.g., between the calendar and the appointment details). Use `stack-md` (16px) for elements within a card.
- **Touch Targets:** Minimum 44x44px for all interactive zones, regardless of the visual size of the icon or text.

## Elevation & Depth

This design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and **Low-contrast Outlines**:

1.  **Base Surface:** Pure White (#FFFFFF).
2.  **Container Surface:** Very light grey or a 2% opacity tint of the Primary color to distinguish sections without creating "floating" boxes.
3.  **Outlines:** Subtle 1px borders (#E2E8F0) are preferred over shadows for input fields and cards.
4.  **Interaction Depth:** Only the "Primary Action" button may use a soft, diffused lavender shadow (10% opacity) to indicate it is the most important element on the screen.

## Shapes

The shape language is **Rounded**, reflecting the soft and welcoming nature of a salon environment. 

Standard components (buttons, input fields) use a 0.5rem (8px) radius. Larger layout containers (cards, modals) should use a 1rem (16px) radius to feel more approachable. This moderate rounding strikes a balance between professional precision and friendly accessibility.

## Components

### Buttons
- **Primary:** Solid Lavender (#8B8CC7) with White text. Bold, 16px font.
- **Secondary:** White background with Lavender border and text.
- **Ghost:** No background or border; Lavender text. Used for "Cancel" or less frequent actions.

### Input Fields
- High contrast: White background with a 1px Slate-200 border. 
- Focus state: Border changes to Primary Lavender with a subtle 2px outer glow.
- Labels are always positioned above the field, never as placeholder-only.

### Cards
- Used for Client Profiles and Appointment slots. 
- No shadow; use a 1px border. 
- Header section of the card should have a subtle tint of Sage or Lavender to categorize the entry.

### Chips & Badges
- Used for service types (e.g., "Haircut," "Coloring").
- Pill-shaped with a 10% opacity background of the Primary or Secondary color and full-opacity text.

### Scheduling Grid
- Clean, vertical timeline. 
- Current time marker is a thin Lavender line with a small circle. 
- Empty slots should have a dashed border to signify "available space."