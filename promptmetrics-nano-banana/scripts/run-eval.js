#!/usr/bin/env node
/**
 * run-eval.js - Automated eval runner for the promptmetrics-nano-banana skill.
 *
 * Usage:
 *   node scripts/run-eval.js
 *
 * Runs:
 *   1. SKILL.md frontmatter validation
 *   2. plugin.json / marketplace.json schema validation
 *   3. Upstream data availability
 *   4. Search script smoke test
 *   5. brand-check.js positive and negative cases
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

let exitCode = 0;
const results = [];

function log(test, passed, message) {
  results.push({ test, passed, message });
  const icon = passed ? '✓' : '✗';
  console.log(`${icon} ${test}: ${message}`);
}

function run(cmd, options = {}) {
  return execSync(cmd, { encoding: 'utf8', cwd: rootDir, ...options });
}

function validateFrontmatter() {
  const skill = readFileSync(join(rootDir, 'SKILL.md'), 'utf8');
  const parts = skill.split('---');
  if (parts.length < 3) {
    log('Frontmatter delimiters', false, 'SKILL.md missing frontmatter delimiters');
    return false;
  }
  const front = parts[1];
  // Basic YAML checks without external deps.
  const nameMatch = front.match(/^name:\s*(\S+)$/m);
  if (!nameMatch) {
    log('Frontmatter name', false, 'name field missing');
    return false;
  }
  const name = nameMatch[1];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    log('Frontmatter name format', false, `name "${name}" is not kebab-case`);
    return false;
  }
  const descMatch = front.match(/^description:\s*\|?\s*\n?([\s\S]*?)(?=\n[a-z]+:|\n---|$)/m);
  const description = descMatch ? descMatch[1].replace(/\n\s+/g, ' ').trim() : '';
  if (description.length > 1024) {
    log('Frontmatter description length', false, `description is ${description.length} chars (max 1024)`);
    return false;
  }
  if (description.includes('<') || description.includes('>')) {
    log('Frontmatter description XML', false, 'description contains angle brackets');
    return false;
  }
  if (!front.includes('platforms:') || !front.includes('claude-code') || !front.includes('claude-for-work')) {
    log('Frontmatter platforms', false, 'platforms must include claude-code and claude-for-work');
    return false;
  }
  log('Frontmatter', true, `name=${name}, desc_len=${description.length}, no XML`);
  return true;
}

function validateJsonFile(path, label) {
  const fullPath = join(rootDir, path);
  if (!existsSync(fullPath)) {
    log(label, false, `${path} missing`);
    return false;
  }
  try {
    const data = JSON.parse(readFileSync(fullPath, 'utf8'));
    const required = ['name', 'description', 'version', 'author', 'platforms', 'tags'];
    for (const key of required) {
      if (!(key in data)) {
        log(label, false, `missing field: ${key}`);
        return false;
      }
    }
    log(label, true, 'valid JSON with required fields');
    return true;
  } catch (err) {
    log(label, false, `invalid JSON: ${err.message}`);
    return false;
  }
}

function validateUpstream() {
  const manifestPath = join(rootDir, 'references', 'upstream', 'manifest.json');
  if (!existsSync(manifestPath)) {
    log('Upstream data', false, 'manifest.json not downloaded; run node scripts/setup.js');
    return false;
  }
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!Array.isArray(manifest.categories) || manifest.categories.length === 0) {
      log('Upstream manifest', false, 'categories array missing or empty');
      return false;
    }
    log('Upstream data', true, `${manifest.categories.length} categories available`);
    return true;
  } catch (err) {
    log('Upstream manifest', false, `invalid JSON: ${err.message}`);
    return false;
  }
}

function smokeTestSearch() {
  try {
    const out = run('node scripts/search-prompts.js --category infographic-edu-visual --query "diagram" --limit 1');
    const data = JSON.parse(out);
    if (!data.results || data.results.length === 0) {
      log('Search smoke test', false, 'no results returned');
      return false;
    }
    log('Search smoke test', true, `${data.results.length} result(s) from ${data.category.slug}`);
    return true;
  } catch (err) {
    log('Search smoke test', false, err.message);
    return false;
  }
}

function testBrandCheck() {
  const compliant = "Editorial diagram on warm cream paper background #f4efe7. Fraunces headline with one italic coral word. Lucide-style thin icons. No emoji, no gradients, no glow.";
  const nonCompliant = "A neon glowing 3D cyberpunk cityscape with emojis 🚀 and stock photography on a pure black background! UNLOCK the synergy!";

  try {
    const good = JSON.parse(run(`node scripts/brand-check.js --prompt ${JSON.stringify(compliant)}`));
    if (!good.passed) {
      log('Brand check compliant', false, `expected pass, got ${good.verdict}`);
      return false;
    }
    log('Brand check compliant', true, `score ${good.score}/${good.maxScore}`);

    const bad = JSON.parse(run(`node scripts/brand-check.js --prompt ${JSON.stringify(nonCompliant)}`));
    if (bad.passed) {
      log('Brand check non-compliant', false, 'expected fail, got pass');
      return false;
    }
    log('Brand check non-compliant', true, `caught ${bad.conflicts.length} conflict(s)`);
    return true;
  } catch (err) {
    log('Brand check tests', false, err.message);
    return false;
  }
}

function main() {
  console.log('Running promptmetrics-nano-banana eval suite\\n');

  validateFrontmatter();
  validateJsonFile('.claude-plugin/plugin.json', 'plugin.json');
  validateJsonFile('.claude-plugin/marketplace.json', 'marketplace.json');
  validateUpstream();
  smokeTestSearch();
  testBrandCheck();

  const failed = results.filter(r => !r.passed);
  console.log(`\\n${results.length - failed.length}/${results.length} tests passed`);
  if (failed.length > 0) {
    console.log('\\nFailed tests:');
    failed.forEach(f => console.log(`  - ${f.test}: ${f.message}`));
    process.exit(1);
  }
}

main();
