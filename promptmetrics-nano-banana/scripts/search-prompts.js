#!/usr/bin/env node
/**
 * search-prompts.js - Token-efficient search of the upstream Nano Banana prompt library.
 *
 * Usage:
 *   node scripts/search-prompts.js --category product-marketing --keyword "editorial" --limit 2
 *   node scripts/search-prompts.js --category social-media-post --query "festival" --limit 3
 *
 * Prints a JSON object with matching prompt records to stdout.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const upstreamDir = join(__dirname, '..', 'references', 'upstream');

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

function loadCategory(categorySlug) {
  const manifestPath = join(upstreamDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('Upstream manifest not found. Run node scripts/setup.js first.');
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const category = manifest.categories.find(c => c.slug === categorySlug || c.title === categorySlug);
  if (!category) {
    const available = manifest.categories.map(c => `${c.slug} (${c.title})`).join(', ');
    throw new Error(`Unknown category "${categorySlug}". Available: ${available}`);
  }
  const filePath = join(upstreamDir, category.file);
  if (!existsSync(filePath)) {
    throw new Error(`Category file missing: ${category.file}. Run node scripts/setup.js.`);
  }
  const records = JSON.parse(readFileSync(filePath, 'utf8'));
  if (!Array.isArray(records)) {
    throw new Error(`Invalid category file: ${category.file} (expected array)`);
  }
  return { manifest, category, records };
}

function searchRecords(records, keyword, limit) {
  const q = (keyword || '').toLowerCase().trim();
  if (!q) return records.slice(0, limit);
  const matches = [];
  for (const rec of records) {
    const haystack = [
      rec.title,
      rec.description,
      rec.content,
      ...(Array.isArray(rec.tags) ? rec.tags : [])
    ].filter(Boolean).join(' ').toLowerCase();
    if (haystack.includes(q)) {
      matches.push(rec);
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const categorySlug = args.category || args.c;
  const keyword = args.keyword || args.query || args.k || args.q;
  const limit = parseInt(args.limit || args.l || '3', 10);

  if (!categorySlug) {
    console.error('Usage: node scripts/search-prompts.js --category <slug> --keyword <word> [--limit N]');
    process.exit(1);
  }

  const { category, records } = loadCategory(categorySlug);
  const matches = searchRecords(records, keyword, limit);

  const result = {
    category: { slug: category.slug, title: category.title, file: category.file },
    keyword: keyword || null,
    limit,
    totalMatches: matches.length,
    results: matches
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
