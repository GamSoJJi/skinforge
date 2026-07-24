# SkinForge — Cute & Friendly Studio Redesign

**One-line summary:** Refactor SkinForge's Minecraft skin editor UI from a cold Photoshop-like tool to an approachable, warm, pixel-cute studio experience.

**Date:** 2026-07-23
**Status:** confirmed

---

## What

A web-based Minecraft skin editor (2D pixel canvas + 3D preview) that currently looks and feels like a professional design tool. The goal is to make it feel like a cozy creative studio — inviting and fun without sacrificing pixel-editing precision.

## Who

Minecraft players who edit their own skins — casual to intermediate creators. They care about accuracy on the canvas but want the surrounding UI to feel like a game, not a job.

## Brand & Mood

- **DNA**: Pixel-retro cute. Silkscreen font is the identity anchor — keep it for logo/title/section headers.
- **Body text**: Switch to a rounded sans-serif (Nunito or Fredoka One) for all UI labels, tooltips, and secondary text. This creates a "pixel game with friendly UI" contrast.
- **Feel words**: Cozy, approachable, warm, playful, cute — not kawaii-extreme, but clearly friendly.

## Theme Strategy

**Light mode ships first.** Dark mode follows using the same CSS variable token structure.

### Light Theme — Cute Cream
| Role | Value |
|---|---|
| Background | `#FEFDF5` |
| Surface (panels) | `#FFFFFF` / `#FFF0F5` |
| Accent primary | Coral `#FF7F50` |
| Accent secondary | Soft Lavender |
| Accent tertiary | Butter Yellow |

### Dark Theme — Cozy Charcoal (later)
| Role | Value |
|---|---|
| Background | `#1E1E2E` |
| Surface | `#181825` |
| Accents | Muted pastel neon variants of light-mode accents |

Note: Dark mode CSS was already partially refactored (purple-tinted surfaces `#1a1726`) before this brief. That work forms the dark theme foundation.

## Layout (unchanged)
- **Center**: 2D skin unwrap pixel canvas
- **Top bar**: Logo, File/Color menus, toggles
- **Left bar**: Tool panel (pencil, eraser, fill, eyedropper, selection)
- **Right bar**: 3D preview + color palette/picker
- **Bottom bar**: Tips, status, theme controls

## Component Rules

**Rounded corners everywhere** — panels, canvas grid border, palette tiles, toolbar buttons, inputs, modals.

**Icons**: Full redesign. Direction: **chunky rounded stroke icons** — thick 2px+ stroke, rounded linecaps/linejoin, slightly oversized silhouettes for a friendly handcrafted feel. Custom SVG (not a library) since there are only 5–6 icons total. Same semantics (pen, eraser, fill, eyedropper, selection, star) but completely redrawn shapes.

**Micro-interactions**:
- Hover: slight scale-up + subtle bounce on buttons
- Loading/toast: playful animation (not spinner-generic)

**UX tone**: Friendly and supportive. Tooltips warm ("Here's a tip!"), error messages non-alarming, labels clean and legible.

## Taste Signals (dealer pins)
- Silkscreen stays as the pixel-identity font — never replace for brand/header uses
- Icons: chunky rounded stroke style, custom SVG redraws of all 5–6 toolbar icons
- Not over-the-top kawaii — cute but functional, usability never sacrificed
- Both themes share the same CSS variable token structure from day one

## Open Questions
- Exact rounded sans-serif font choice: Nunito vs Fredoka One vs other (resolve in plan/design DNA step)
- Specific lavender and butter yellow hex values for light theme accents (resolve in DESIGN.md)
- Mascot/character guidance: mentioned as a tone direction — no concrete mascot asset exists yet; treat as future scope
- Dark mode schedule: after light mode is confirmed and shipped
