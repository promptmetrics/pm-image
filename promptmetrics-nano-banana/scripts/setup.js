#!/usr/bin/env node
/**
 * setup.js - Downloads/updates upstream Nano Banana Pro prompt library.
 *
 * Upstream files are kept under references/upstream/ so they are clearly
 * separated from PromptMetrics-specific brand guides and examples.
 *
 * Usage:
 *   node scripts/setup.js           # Download missing upstream files
 *   node scripts/setup.js --force   # Force re-download all upstream files
 *   node scripts/setup.js --check   # Auto-update if stale or missing (>24h)
 */

import { existsSync, mkdirSync, statSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const refsDir = join(__dirname, '..', 'references');
const upstreamDir = join(refsDir, 'upstream');
const stampFile = join(upstreamDir, '.last-updated');

const BASE_URL = 'https://raw.githubusercontent.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill/main/references';
const STALE_HOURS = 24;

function isStale() {
  if (!existsSync(stampFile)) return true;
  const ts = parseInt(readFileSync(stampFile, 'utf8').trim(), 10);
  return Number.isNaN(ts) || (Date.now() - ts) / 1000 / 3600 > STALE_HOURS;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.text();
}

async function setup() {
  const args = process.argv.slice(2);
  const forceMode = args.includes('--force');
  const checkMode = args.includes('--check');

  if (checkMode && !isStale() && existsSync(stampFile)) {
    return;
  }

  if (!existsSync(refsDir)) mkdirSync(refsDir, { recursive: true });
  if (!existsSync(upstreamDir)) mkdirSync(upstreamDir, { recursive: true });

  const label = forceMode ? 'Updating' : 'Downloading';
  console.log(`[setup] ${label} upstream Nano Banana Pro prompt library from GitHub...`);

  let categories;
  try {
    const manifestText = await fetchText(`${BASE_URL}/manifest.json`);
    const manifest = JSON.parse(manifestText);
    categories = manifest.categories;
    writeFileSync(join(upstreamDir, 'manifest.json'), manifestText, 'utf8');
    console.log(`  manifest: ${categories.length} categories, ${manifest.totalPrompts} prompts total`);
  } catch (err) {
    console.warn(`[setup] Could not fetch manifest: ${err.message}`);
    console.warn('[setup] Falling back to existing local upstream manifest...');
    const localManifest = join(upstreamDir, 'manifest.json');
    if (!existsSync(localManifest)) {
      console.error('[setup] No upstream manifest available. Run with --force to retry.');
      process.exit(0);
    }
    categories = JSON.parse(readFileSync(localManifest, 'utf8')).categories;
  }

  const validFiles = new Set([...categories.map(c => c.file), 'manifest.json', '.last-updated', '.gitkeep']);
  if (forceMode) {
    for (const f of readdirSync(upstreamDir)) {
      if (!validFiles.has(f)) {
        unlinkSync(join(upstreamDir, f));
        console.log(`  removed stale: ${f}`);
      }
    }
  }

  let downloaded = 0, skipped = 0, failed = 0;
  for (const cat of categories) {
    const dest = join(upstreamDir, cat.file);
    if (!forceMode && existsSync(dest) && statSync(dest).size > 100) {
      skipped++;
      continue;
    }
    process.stdout.write(`  → ${cat.file} (${cat.title}, ${cat.count} prompts) ... `);
    try {
      const text = await fetchText(`${BASE_URL}/${cat.file}`);
      writeFileSync(dest, text, 'utf8');
      console.log('ok');
      downloaded++;
    } catch (err) {
      console.log(`failed (${err.message})`);
      failed++;
    }
  }

  if (failed === 0) writeFileSync(stampFile, String(Date.now()), 'utf8');

  if (downloaded > 0) {
    console.log(`[setup] Done! ${downloaded} upstream file(s) ${forceMode ? 'updated' : 'downloaded'}.`);
  } else if (skipped === categories.length) {
    console.log('[setup] All upstream references up to date. Use --force to refresh.');
  }
  if (failed > 0) console.warn(`[setup] ${failed} file(s) failed. Run again to retry.`);
}

setup().catch(err => {
  console.warn('[setup] Warning (non-fatal):', err.message);
  process.exit(0);
});
