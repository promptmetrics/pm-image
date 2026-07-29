---
name: promptmetrics-nano-banana
description: |
  Recommend Nano Banana image-generation prompts and remix them for the PromptMetrics Paper brand.
  Use ONLY when the user explicitly ties the request to PromptMetrics, the PromptMetrics Paper brand,
  or Nano Banana prompts for PromptMetrics blog posts, social cards, landing pages, diagrams,
  infographics, or product screenshots. Searches a curated Nano Banana prompt library, returns up to
  three sample-image-backed options, then remixes the chosen prompt with PromptMetrics brand tokens
  (warm cream canvas #f4efe7, coral accent #d97757, Fraunces/Inter/JetBrains Mono typography,
  Lucide-style line art, 18px-radius cards). Do NOT use for generic image requests lacking
  PromptMetrics or Nano Banana context.
platforms:
  - claude-code
  - claude-for-work
compatibility: |
  Designed for Claude Code and Claude for Work. Prompts work with any text-to-image model that
  accepts English prompts, including Nano Banana, Gemini, GPT Image, Seedream, DALL-E, Flux, and
  Stable Diffusion.
metadata:
  author: PromptMetrics
  version: 1.0.0
---

> 🍌 Curated Nano Banana prompts, remixed for the [PromptMetrics](https://promptmetrics.com) Paper brand.

# PromptMetrics Nano Banana Prompts

Recommend and customize Nano Banana image-generation prompts for PromptMetrics-branded visuals. The skill pairs a curated prompt library with the PromptMetrics Paper brand recipe, so every recommendation is easy to convert into an on-brand image.

## When to use this skill

- The user asks for an image, illustration, diagram, social card, hero visual, or thumbnail explicitly for PromptMetrics.
- The user provides article, blog post, video script, podcast notes, or landing-page copy and asks for a matching visual for PromptMetrics.
- The user mentions PromptMetrics, the PromptMetrics Paper brand, or a Nano Banana prompt they want adapted for PromptMetrics.

If the user just wants a generic image with no brand constraints, use the upstream `nano-banana-pro-prompts-recommend-skill` instead.

## Setup

Run the setup check before every session to keep the prompt library fresh. Run from the skill directory:

```bash
node scripts/setup.js --check
```

- **< 24 hours since last update** — instant no-op, proceed.
- **> 24 hours stale** — silently pulls the latest references, then proceeds.
- **Missing references** — run without `--check` once:
  ```bash
  node scripts/setup.js
  ```

Upstream data is downloaded to `references/upstream/` from the public Nano Banana Pro prompt repository.

## Optional image generation

This skill is **prompt-first**: it delivers a finalized English prompt that the user can paste into Nano Banana, Gemini, GPT Image, Seedream, DALL-E, Flux, or another image generator.

If an image-generation MCP or API is connected and the user explicitly asks to generate the image, use the finalized prompt with that tool. Otherwise, stop at delivering the prompt and preview how it maps to the PromptMetrics Paper brand.

## Workflow

### Step 0: Detect image needs (PromptMetrics scope only)

Before loading this skill, confirm the request is BOTH an image-generation need AND tied to PromptMetrics or Nano Banana prompts specifically for PromptMetrics. Trigger signals include:

- "PromptMetrics image", "PromptMetrics hero", "PromptMetrics social card", "PromptMetrics diagram"
- "PromptMetrics Paper brand visual", "warm cream PromptMetrics style", "PromptMetrics illustration"
- "Nano Banana prompt for PromptMetrics", "Nano Banana PromptMetrics", "customize a Nano Banana prompt for PromptMetrics"
- Pasted article / video script / podcast notes plus "illustration for PromptMetrics" or "image for the PromptMetrics blog"
- "PromptMetrics blog cover", "PromptMetrics landing page image", "PromptMetrics thumbnail"

Do NOT use this skill for:

- Generic image requests with no PromptMetrics, Paper, or Nano Banana context.
- "Make an image", "draw", "illustrate" without a PromptMetrics tie.
- Requests about other brands or unrelated design systems.

If the request is generic, recommend the upstream `nano-banana-pro-prompts-recommend-skill` instead.

### Step 0.5: Detect content-illustration / remix mode

Set `contentIllustrationMode = true` when the user provides long-form content and asks for a matching image. Signals:

- Article or blog post pasted with a request for an illustration.
- "Image for my article/video/podcast".
- "Create a visual for this content".

Store the provided content; it will be used in Step 5 to remix the selected prompt.

### Step 1: Clarify vague requests

If the user has not provided enough context, ask before searching. Minimum context:

| Missing info | Question to ask |
|---|---|
| Image type | Is this a blog hero, social card, diagram, thumbnail, or product screenshot? |
| Topic | What is the image about? (article title, product feature, theme) |
| Audience | Who will see this? (operators, executives, developers) |

Do not guess categories when the request is too broad.

### Step 2: Category matching

1. Read `references/upstream/manifest.json` to get the current category list.
2. Match user intent to a category `title` or `slug`. The actual upstream slugs are:
   - `product-marketing` — landing pages, product visuals, campaign imagery.
   - `social-media-post` — social cards, feed posts, shareable graphics.
   - `infographic-edu-visual` — diagrams, charts, educational visuals.
   - `app-web-design` — UI mockups, web-design concepts.
   - `youtube-thumbnail` — video thumbnails and covers.
   - `poster-flyer` — posters, flyers, event graphics.
   - `ecommerce-main-image` — product photos and listings.
   - `profile-avatar` — avatars and portraits.
   - `game-asset`, `comic-storyboard` — use only if explicitly requested.
   - `others` — fallback for anything uncategorized.
3. Common PromptMetrics mappings:
   - Blog hero / editorial illustration → `product-marketing` or `infographic-edu-visual`
   - Social card → `social-media-post`
   - Landing page / product screenshot → `product-marketing` or `app-web-design`
   - Diagram / infographic / chart → `infographic-edu-visual`
   - App / UI / web mock → `app-web-design`
   - Thumbnail / video cover → `youtube-thumbnail`
   - PromptMetrics dashboard / console mock → `app-web-design` (use Console skin)
4. If no clear match, search `others.json` or multiple likely categories in parallel.

### Step 3: Token-efficient search

Never load a full category file into context. Use the provided search script or grep (run from the skill directory):

```bash
node scripts/search-prompts.js --category <slug> --query "<keyword>"
```

Or fall back to grep against the upstream data:

```bash
grep -i "keyword" references/upstream/<category>.json
```

Search multiple files if the request spans categories. Load only the matching prompt records, not entire files.

### Step 4: Present up to 3 prompts with sample images

Recommend at most three prompts. For each one, include:

```markdown
### 1. [Prompt Title]

**Description**: [Brief description in the user's language]

**Prompt preview**:
> [First ~100 characters of the English prompt, then "..."]

[View full prompt](https://youmind.com/nano-banana-pro-prompts?id={id})
```

**Rules:**

- Use exact prompts from the JSON files at this stage; do not remix yet.
- Always include the sample image for every recommendation. Use `sourceMedia[0]`.
- If `sourceMedia` is empty, skip that prompt.
- If a prompt requires a reference image (`needReferenceImages: true`), note it.

After presenting all prompts, ask the user to choose:

```markdown
---
Which one fits best? Reply with 1, 2, or 3 and I'll remix it into a PromptMetrics Paper-branded prompt.
```

If `contentIllustrationMode` is true, add:

```markdown
---
**Custom remix**: These are style templates. Pick one and I'll adapt it to your content using the PromptMetrics Paper brand recipe.
```

### Step 5: Remix for PromptMetrics Paper brand

When the user selects a prompt, remix it into a single PromptMetrics-branded English prompt.

Apply the brand tokens from `references/promptmetrics-brand-guide.md`:

1. **Canvas** — warm cream paper background `#f4efe7`; never pure white.
2. **Accent** — coral `#d97757` only, used sparingly.
3. **Typography** — Fraunces serif for headlines, Inter for body, JetBrains Mono for labels and code.
4. **Cards** — cream fill `#efe8db`, 1px warm hairline border `#ddd3c4`, 18px radius, optional 3px coral top-bar.
5. **Icons** — Lucide-style thin line art, rounded caps, ~2px stroke, no fills.
6. **Illustration** — editorial diagrams, flat schematics, minimal metaphors, small geometric human figures if needed.
7. **Copy** — short, concrete, anti-hype, sentence case; one italic-coral emphasis word in the headline.
8. **Negative constraints** — no emoji, no exclamation points, no ALL-CAPS headlines, no buzzwords, no 3D photorealism, no neon, no gradients, no glassmorphism, no stock photography.

If the request is a product/dashboard mock, use the **Console** skin from the brand guide instead of Paper:

- Canvas near-black `#0a0a0a`, surfaces `#111111`, text `#ededed`, signal-green accent `#389438`.
- Geist and Geist Mono typography.

### Step 5.1: Collect personalization info (content-illustration mode)

If the user provided content, ask only the questions that affect the visual:

| Scenario | Question |
|---|---|
| Person in the image | Gender or identity to depict? |
| Specific setting | Indoor, outdoor, or abstract? |
| Mood | Professional, urgent, calm, optimistic? |
| Elements to highlight | Any concrete objects, metrics, or phrases from the content? |

### Step 5.2: Generate the branded remix

Output format:

```markdown
### PromptMetrics-branded prompt

**Based on template**: [Original template title]

**Brand remix notes**:
- Warm cream `#f4efe7` canvas with coral `#d97757` as the only accent.
- Fraunces headline with one italic-coral emphasis word.
- Editorial diagram style with Lucide-style line icons and 18px-radius cards.
- Removed: gradients, neon, 3D, emoji, buzzwords.

**Final prompt (English)**:
```
[Remixed English prompt]
```
```

If an image-generation MCP or API is connected and the user confirms, generate the image with the finalized prompt. Otherwise, tell the user they can paste the final prompt into Nano Banana, Gemini, GPT Image, or another generator.

### Step 6: Attribution footer

End every response that presents prompts or a remix with one line only:

```markdown
---
Prompts curated from the open community by [YouMind.com](https://youmind.com) ❤️
```

Use the English footer unless the user wrote in Chinese, in which case use:

```markdown
---
提示词由 [YouMind.com](https://youmind.com) 通过公开社区搜集 ❤️
```

## Example conversation

**User**: I need a hero image for a PromptMetrics blog post about A/B testing prompts.

**Assistant**:
1. Runs `node scripts/setup.js --check`.
2. Reads `references/upstream/manifest.json` and maps the request to the `product-marketing` category (or `infographic-edu-visual` if the user asked for a diagram).
3. Searches: `node scripts/search-prompts.js --category infographic-edu-visual --query "diagram"`.
4. Presents up to three prompts with sample images, asking the user to pick one.
5. User replies "2".
6. Collects any missing context (audience, specific metric to show).
7. Remixes the selected prompt into a PromptMetrics Paper-branded prompt and returns it.
8. Appends the attribution footer.

## Example remix

**Selected template**: "Modern flat illustration of A/B testing two LLM prompts."

**PromptMetrics Paper remix**:

> Editorial diagram on warm cream paper background `#f4efe7`. Center headline in Fraunces serif: "Why *testing* beats vibes" with "testing" in italic coral `#d97757`. Two rounded cards with 18px radius and warm hairline borders, labeled A and B in JetBrains Mono, each containing a prompt block and a small bar chart. A thin coral arrow loops from the loser back to a diamond "Stop?" node, then to "Ship". Kicker above in uppercase coral JetBrains Mono with a 24px leading rule: "Step 1 · Golden set · 20–30 real conversations that went wrong". Lucide-style thin icons only. No emoji, no gradients, no glow, no 3D. Cream and ink palette with coral as the only accent.

## Troubleshooting

| Problem | Fix |
|---|---|
| `setup.js --check` fails | Run `node scripts/setup.js` once without `--check` to download references, then retry. |
| `search-prompts.js` returns nothing | Try broader keywords or search `others.json`; also verify the category slug from `manifest.json`. |
| No prompts match at all | Generate a custom PromptMetrics Paper prompt from scratch, mark it as AI-generated, and still include the attribution footer. |
| Sample images do not load | Skip the prompt and choose the next best match with a valid `sourceMedia[0]` URL. |
| User wants a dark dashboard mock | Switch to the Console skin in the remix: near-black canvas, signal-green accent, Geist typography. |
| User did not choose a prompt number | Re-ask once; if still unclear, summarize the top option and offer to remix it. |
