#!/usr/bin/env node
/**
 * brand-check.js - Check a prompt against the PromptMetrics Paper brand constraints.
 *
 * Usage:
 *   node scripts/brand-check.js --prompt "A neon cyberpunk cityscape with emojis and 3D renders on a black background"
 *
 * Prints a JSON verdict to stdout.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandGuidePath = join(__dirname, '..', 'references', 'promptmetrics-brand-guide.md');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith('--')) {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key.slice(2)] = next;
        i++;
      } else {
        args[key.slice(2)] = true;
      }
    }
  }
  return args;
}

function hasEmoji(text) {
  // Decorative emoji only; arrows and useful symbols are allowed in diagrams.
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F100}-\u{1F1FF}]|[\u{1F200}-\u{1F2FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]/u;
  return emojiRegex.test(text);
}

function isNegated(text, matchIndex) {
  // Look back up to 30 chars for a negation word before this match.
  const before = text.slice(Math.max(0, matchIndex - 30), matchIndex).toLowerCase();
  return /\b(no|not|avoid|without|never|removed:|removing|excluding|exclude|don['']t|won['']t)\b/.test(before);
}

function findConflict(text, regex, rule, reason) {
  const conflicts = [];
  let match;
  const localRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((match = localRegex.exec(text)) !== null) {
    if (!isNegated(text, match.index)) {
      conflicts.push({ rule, reason });
      break;
    }
  }
  return conflicts;
}

function checkBrand(promptText) {
  if (!existsSync(brandGuidePath)) {
    throw new Error(`Brand guide not found at ${brandGuidePath}.`);
  }
  const guide = readFileSync(brandGuidePath, 'utf8');
  const lower = promptText.toLowerCase();
  const conflicts = [];

  if (/pure\s+white\s+background/.test(lower) || (/white\s+background/.test(lower) && !/warm/.test(lower))) {
    conflicts.push({ rule: 'canvas', reason: 'Prompt asks for a white background; Paper canvas must be warm cream #f4efe7.' });
  }
  if (/pure\s+black/.test(lower) || /black\s+background/.test(lower)) {
    conflicts.push({ rule: 'canvas', reason: 'Prompt asks for a pure/black background; Paper canvas must be warm cream #f4efe7.' });
  }

  conflicts.push(...findConflict(lower, /neon/, 'color', 'Prompt mentions neon, which conflicts with the muted coral-only accent palette.'));
  conflicts.push(...findConflict(lower, /gradient/, 'color', 'Prompt mentions gradients, which are excluded from the Paper style.'));

  if (/3d\s+render|\b3d\b/.test(lower) && !/diagram/.test(lower)) {
    conflicts.push(...findConflict(lower, /3d\s+render|\b3d\b/, 'style', 'Prompt includes 3D renders, which conflict with flat editorial diagrams.'));
  }

  conflicts.push(...findConflict(lower, /photorealistic|stock\s+photo|stock\s+photography/, 'style', 'Prompt requests photorealism or stock photography, which are not allowed.'));
  conflicts.push(...findConflict(lower, /glassmorphism|glass\s+morphism/, 'style', 'Prompt mentions glassmorphism, which is excluded.'));
  conflicts.push(...findConflict(lower, /cyberpunk|isometric\s+cityscape|full-bleed\s+hero/, 'style', 'Prompt mentions cyberpunk/cityscapes/full-bleed heroes, which conflict with minimal editorial diagrams.'));
  conflicts.push(...findConflict(lower, /glow|sparkle|glowing/, 'effect', 'Prompt mentions glow/sparkle effects, which conflict with quiet paper style.'));
  conflicts.push(...findConflict(lower, /\b(unlock|leverage|transform|synergy)\b/, 'voice', 'Prompt contains hype buzzwords excluded from Paper voice.'));
  conflicts.push(...findConflict(lower, /\bemojis?\b/, 'voice', 'Prompt explicitly asks for emoji/emojis, which are not allowed.'));

  if (hasEmoji(promptText)) {
    conflicts.push({ rule: 'voice', reason: 'Prompt contains decorative emoji characters, which are not allowed.' });
  }
  if (/!/.test(promptText)) {
    conflicts.push({ rule: 'voice', reason: 'Prompt contains exclamation marks, which are not allowed.' });
  }

  // ALL-CAPS check: allow short uppercase micro-labels (1-4 chars), common acronyms,
  // and standard diagram labels. Count distinct words so repeated labels don't inflate.
  const allowedCaps = new Set(['METR', 'NBER', 'FAQ', 'CEO', 'CFO', 'ROI', 'AI', 'SaaS', 'SMB', 'CSAT', 'NPS', 'UI', 'UX', 'BEFORE', 'AFTER', 'INPUT', 'OUTPUT']);
  const capsMatches = promptText.match(/\b[A-Z]{3,}\b/g) || [];
  const distinctFlagged = new Set(
    capsMatches.filter((word) => word.length > 4 || !allowedCaps.has(word))
  );
  if (distinctFlagged.size > 3) {
    conflicts.push({ rule: 'voice', reason: 'Prompt contains excessive ALL-CAPS words beyond micro-labels.' });
  }

  const maxScore = 12;
  const score = maxScore - conflicts.length;
  const passed = conflicts.length === 0;

  return {
    prompt: promptText,
    brand: 'PromptMetrics Paper',
    passed,
    score,
    maxScore,
    verdict: passed
      ? 'No conflicts detected. Prompt aligns with PromptMetrics Paper brand.'
      : `Found ${conflicts.length} conflict(s) with the PromptMetrics Paper brand.`,
    conflicts,
    guideExcerpt: guide
      .split('## Negative constraints')[1]
      ?.split('---')[0]
      ?.trim()
      ?.slice(0, 400) || undefined
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const promptText = args.prompt || args.p;

  if (!promptText) {
    console.error('Usage: node scripts/brand-check.js --prompt "<image prompt>"');
    process.exit(1);
  }

  const result = checkBrand(promptText);
  console.log(JSON.stringify(result, null, 2));
}

main();
