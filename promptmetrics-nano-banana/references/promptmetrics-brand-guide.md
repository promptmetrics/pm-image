# PromptMetrics Paper Brand Guide

## Brand summary

PromptMetrics is a warm, editorial, anti-hype B2B brand for governed Claude agents. Its primary visual skin, **Paper**, reads like a serif magazine layout that ships software: warm cream paper, a single coral accent, thin line-art icons, and concrete operator language. The secondary **Console** skin is a dark in-product dashboard theme used only for app/admin mocks.

**Colors (Paper)**
- Canvas: warm cream `#f4efe7`
- Card/panel fill: `#efe8db`
- Text: warm near-black `#1c1c1c` (never pure black)
- Single brand accent: coral `#d97757` used sparingly for top-bars, rules, focus, italic emphasis; darkened `#a94d30` for small text
- Hairlines: warm `#ddd3c4` / `#cabfac`
- Shadows: soft warm-tinted ink shadows using `rgba(28,28,28,…)`, two levels only; never black shadows or blur behind cards
- Texture: optional subtle warm paper grain or dot-grid at low opacity; never strong patterns
- Semantic tones are desaturated and paper-friendly.

**Typography**
- Display + headings: **Fraunces** serif, weight 500, `-0.02em` tracking, italic-coral on the single emphasis word.
- Body / UI: **Inter** sans-serif.
- Labels / kickers / code / metadata / terminal: **JetBrains Mono**.
- Micro-labels: uppercase JetBrains Mono with `0.1em` wide tracking; kickers include a 24px coral leading rule.

**Layout & shape**
- Max container 1200px, narrow reading 720px, prose capped at ~66ch.
- 4pt spacing grid; vertical rhythm 64px default / 96px hero / 40px tight.
- Cards: `--pm-paper-2` fill, 1px warm hairline border, **18px radius**, 3px category-colored top bar, dashed hairline footer.
- Inputs 10px radius; buttons/chips/tags full pills (`999px`); small chrome 6–8px.

**Shadows, lines, effects**
- Soft warm-tinted shadows using ink `rgba(28,28,28,…)`, not black. Two levels only.
- Hairline section dividers. Sticky nav uses cream at 86% opacity with `saturate(160%) blur(10px)`.
- No blur behind cards, no glassmorphism, no strong gradients.

**Iconography & illustration**
- Icons: **Lucide** — thin, rounded-cap, ~1.75–2px stroke line icons.
- Custom mark: the four-blade coral pinwheel logo. Use it where a brand mark belongs; never redraw or alter its geometry.
- Imagery is minimal line-art, editorial diagrams, simple metaphors, and UI schematics. No photorealistic 3D, no stock photography, no full-bleed hero images.
- Status markers: small colored dots, thin check marks, small switch toggles — simple geometry, not filled icon backgrounds.

**Motion**
- Gentle, paper-soft. Ease `cubic-bezier(.2,.7,.2,1)`; durations 150/250/320ms.
- Hover vocabulary: card lift `translateY(-3px)`, link arrow nudge, border darken.
- No bounce, no infinite loops, no parallax. Respect `prefers-reduced-motion`.

**Voice**
- Plainspoken, anti-hype operator-to-operator. Direct address. Sentence case.
- Short punchy fragments. Concrete unrounded numbers (`~$45K`, `44 agents`, `~90 seconds`).
- Governance vocabulary: plan mode, approval gates, audit trail, human gate, never autonomous, read-only by default.
- Slash commands in mono (`/customer-context`).
- No emoji. No ALL-CAPS except mono micro-labels and kickers.

---

## Prompt style recipe

Use these instructions as an image-generation prompt recipe:

1. **Canvas** — Warm cream paper background `#f4efe7`; never pure white. Subtle warm grain or dot-grid allowed at low opacity.
2. **Color accent** — Use coral `#d97757` as the single accent hue, sparingly: card top-bars, the one italic emphasis word, a rule/underline, a small solid dot, a terminal cursor, or the active toggle. No other saturated brand colors.
3. **Typography** — Headlines in Fraunces serif, weight 500, `-0.02em` tracking, with exactly one italic-coral emphasis word. Body in Inter. Labels, kickers, code snippets, numbers, and terminal text in JetBrains Mono; micro-labels are uppercase with `0.1em` wide tracking and a 24px coral leading rule.
4. **Cards and panels** — Cream fills `#efe8db`, 1px warm hairline border `#ddd3c4`, generous 18px radius. Add a thin 3px coral or category-colored bar across the top of feature cards. Use dashed hairline footers for metadata.
5. **Icons** — Draw with thin Lucide-style line art: rounded caps/joins, ~2px stroke, no fills, no emoji. Use simple metaphors: loop arrows, compass, knots, bar charts, switches, clocks, terminal cursors.
6. **Illustration style** — Editorial diagrams, flat schematics, and minimal metaphors. Outlined objects, soft shadows, small human figures in simple geometric style if needed. No photorealism, no glossy 3D, no neon, no gradients.
7. **Layout** — Generous whitespace, two-column editorial splits, narrow reading measure, clear visual hierarchy. Two or three columns of equal-height cards are a signature pattern.
8. **Copy tone** — Short, concrete, anti-hype. Sentence case. Avoid buzzwords like "unlock," "leverage," "transform," "synergy." No exclamation points. No emoji.
9. **Terminal / code proof** — If showing product UI, include one dark panel `#211d19` with cream text and a coral accent, macOS traffic-light dots, and a JetBrains Mono prompt (`$ /command`).
10. **Shadows** — Soft warm shadows in ink `rgba(28,28,28,…)`. Resting surfaces rely on border + fill; reserve shadow for hover-lifted cards or floating panels. No blur behind cards.
11. **Status markers** — Use simple geometry: colored dots, thin check marks, small switch toggles. Avoid filled icon backgrounds unless the swatch is intentionally a coral-fill tile.

---

## Negative constraints

Avoid these when generating PromptMetrics-branded imagery:

- Pure white backgrounds, pure black text, or high-contrast glossy UI.
- Multiple bright saturated hues beyond the single coral accent (category accents are muted and used only for tagging).
- Photorealistic 3D renders, stock photography, AI-glow brains, isometric cityscapes, or full-bleed hero photos.
- Lucide icons mixed with filled, heavy, or outline-only-without-round-caps icon families.
- Emoji, exclamation marks, ALL-CAPS headlines, or buzzword copy.
- Purple/blue gradient backgrounds, glassmorphism, neon glows, sparkles, or parallax effects.
- Rounded rectangles tighter than 6px or sharper than the 18px signature card radius.
- More than one italic-coral emphasis word per headline.
- Abstract geometric decoration that does not support a concrete concept.

---

## Skin switch: Console

Use the **Console** skin only when the image is explicitly mocking the in-product dashboard, admin, or CMS — never for outward-facing marketing.

- Canvas: near-black `#0a0a0a`
- Surface cards: `#111111`
- Text: `#ededed`
- Brand hue: signal-green `#389438` and bright `#5cc15c`
- Typography: Geist (sans) and Geist Mono
- Lines: white at 10% / 18% opacity
- Glow: green `rgba(56,148,56,0.3)`
- Keep the same quiet, minimal component shapes, but swap cream for dark and coral for signal-green.
