# Design: "Now Streaming"

The site borrows the language of a TV streaming app, the kind of 10-foot interface Manos has built for a decade: a featured billboard, horizontal rails of cards, and focus you can move with the arrow keys like a remote. It should feel like a polished product, not a template.

## Principles
1. **Content first, chrome second.** Real CV facts only. The streaming metaphor frames the content; it never replaces it.
2. **Focus is the hero interaction.** Every card has an unmistakable focused state (scale + ring + glow), just like on a TV.
3. **Readable everywhere.** Every rail has a plain, semantic twin ("Full credits") for screen readers, ATS crawlers and print.
4. **Quiet motion.** Short, eased transitions; everything disabled under `prefers-reduced-motion`.

## Tokens (src/styles/global.css)
| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | near-black violet `oklch(.145 .012 285)` | warm paper `oklch(.975 .004 85)` | page |
| `bg-raised` / `surface` | lifted panels | white / soft grey | cards, dialogs |
| `ink` / `ink-soft` / `ink-faint` | text tiers | text tiers | body, secondary, meta |
| `accent` | violet `oklch(.74 .16 295)` | violet `oklch(.5 .22 295)` | focus rings, links, highlights |
| `live` | amber | darker amber | "available" status dot only |

All colours use `light-dark()`; the theme toggle only sets `color-scheme` via `data-theme` on `<html>`. Text tiers meet WCAG AA on `bg` in both themes.

## Type
- **Display:** Bricolage Grotesque (variable): headings, card titles, client tiles.
- **Body:** Hanken Grotesk (variable).
- **Greek pages (/el/):** Commissioner (variable) for headings and body, since Bricolage and Hanken have no Greek letters. JetBrains Mono already covers Greek.
- **Meta:** JetBrains Mono, uppercase, tracked +0.14em: eyebrows, periods, badges.
- Scale is fluid with `clamp()`; hero name tops out around 5.5rem.

## Card artwork
No logos or brand colours. Every card's art is generated from a single hue (`--h`) with the `.art` gradient. Platform hues: Roku 300, Apple TV 235, PlayStation 258, Windows 200, Web 30, Other 140. Clients and case studies set their own decorative hue.

## Components
| Component | Shape | Notes |
|---|---|---|
| Billboard (Hero) | full-bleed, ≥ 78vh | headshot fades into the background with a mask; monogram until a photo is added |
| Role card | 16:9 thumbnail + title below, 300px | opens a details dialog |
| Poster card | 2:3 portrait, 220px | links to a case-study page |
| Client tile | 16:9, 240px | name set in display type |
| Skill tile | 340px wide panel | category + chips |
| Details dialog | native `<dialog>`, max 720px | Esc / backdrop click closes |

## Interaction
- Rails use a roving `tabindex`: Tab enters a rail once; ← → move along it; ↑ ↓ jump to the nearest card in the rail above or below; Home/End jump to the ends.
- Mouse users get arrow buttons on hover; touch users swipe (scroll-snap).
- Focused card: `scale(1.06)`, 3px accent ring with a bg-coloured gap, soft accent glow.
