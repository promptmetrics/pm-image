# pm-image

A Claude skill for generating PromptMetrics-branded images with Nano Banana Pro.

## What lives here

- `promptmetrics-nano-banana/` — the Claude skill folder.
  - `SKILL.md` — main skill instructions and frontmatter.
  - `references/promptmetrics-brand-guide.md` — distilled PromptMetrics Paper brand rules.
  - `references/promptmetrics-examples.md` — before/after brand-remix examples.
  - `scripts/setup.js` — downloads/updates upstream Nano Banana prompt references.
  - `scripts/search-prompts.js` — token-efficient search of the prompt library.
  - `scripts/brand-check.js` — checks a prompt against PromptMetrics Paper constraints.
  - `evals/` — trigger and remix evaluation cases.
  - `.claude-plugin/` — Claude marketplace metadata.

## Quick start

1. Install the skill in Claude Code by pointing it at the `promptmetrics-nano-banana/` folder.
2. The skill auto-downloads upstream prompt data on first use:
   ```bash
   cd promptmetrics-nano-banana
   node scripts/setup.js
   ```
3. Ask Claude:
   
   > "I need a PromptMetrics-style hero image for a blog post about A/B testing prompts."

## Adding to the remote repo

This skill is intended to be added to `https://github.com/promptmetrics/pm-image`. Stage the `promptmetrics-nano-banana/` folder and any repo-level files, then push as usual.
