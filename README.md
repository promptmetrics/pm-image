# pm-image

A Claude skill for generating PromptMetrics-branded images with Nano Banana Pro.

## What lives here

- `.claude-plugin/marketplace.json` — Claude Code marketplace catalog for this repo.
- `promptmetrics-nano-banana/` — the Claude skill folder.
  - `SKILL.md` — main skill instructions and frontmatter.
  - `references/promptmetrics-brand-guide.md` — distilled PromptMetrics Paper brand rules.
  - `references/promptmetrics-examples.md` — before/after brand-remix examples.
  - `scripts/setup.js` — downloads/updates upstream Nano Banana prompt references.
  - `scripts/search-prompts.js` — token-efficient search of the prompt library.
  - `scripts/brand-check.js` — checks a prompt against PromptMetrics Paper constraints.
  - `evals/` — trigger and remix evaluation cases.
  - `.claude-plugin/plugin.json` — plugin manifest.

## Install from the Claude Code marketplace

1. Add the PromptMetrics marketplace:
   ```bash
   /plugin marketplace add promptmetrics/pm-image
   ```
2. Install the plugin:
   ```bash
   /plugin install promptmetrics-nano-banana@pm-image
   ```
3. Activate it:
   ```bash
   /reload-plugins
   ```

The skill auto-downloads upstream prompt data on first use.

## Local development

To test the plugin from this repo without installing through the marketplace:

```bash
claude --plugin-dir ./promptmetrics-nano-banana
```

Then run the setup check:

```bash
cd promptmetrics-nano-banana
node scripts/setup.js
```

## Ask Claude

> "I need a PromptMetrics-style hero image for a blog post about A/B testing prompts."

## Adding to the remote repo

This skill is intended to be added to `https://github.com/promptmetrics/pm-image`. Stage the `promptmetrics-nano-banana/` folder and any repo-level files, then push as usual.
