#!/usr/bin/env node

/**
 * Release Tagging Helper Script
 * Usage: node scripts/release-tag.mjs [version]
 * Example: node scripts/release-tag.mjs 1.0.0
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

function run(command, cwd = rootDir) {
  return execSync(command, { cwd, encoding: 'utf-8', stdio: ['inherit', 'pipe', 'pipe'] }).trim();
}

try {
  // 1. Get version from argument or package.json
  const argVersion = process.argv[2];
  let version = argVersion;

  if (!version) {
    const pkg = JSON.parse(readFileSync(resolve(rootDir, 'jak-sa/package.json'), 'utf-8'));
    version = pkg.version;
  }

  // Ensure format vX.Y.Z
  const tag = version.startsWith('v') ? version : `v${version}`;

  console.log(`\n🏷️  Preparing release tag: ${tag}\n`);

  // 2. Check git cleanliness
  const status = run('git status --porcelain');
  if (status) {
    console.error('❌ Git working tree has unstaged or uncommitted changes. Commit or stash them first.');
    process.exit(1);
  }

  // 3. Check current branch
  const currentBranch = run('git rev-parse --abbrev-ref HEAD');
  if (currentBranch !== 'main') {
    console.warn(`⚠️  Warning: Current branch is "${currentBranch}", expected "main".`);
  }

  // 4. Verify tests and typechecking
  console.log('🧪 Running quality gates...');
  run('node scripts/validate-data.mjs');
  run('pnpm --dir jak-sa typecheck');
  run('pnpm --dir jak-sa test');
  console.log('✅ Quality gates passed!\n');

  // 5. Check if tag already exists
  const existingTags = run('git tag -l').split('\n').map(t => t.trim());
  if (existingTags.includes(tag)) {
    console.error(`❌ Tag "${tag}" already exists.`);
    process.exit(1);
  }

  // 6. Create annotated tag
  console.log(`📌 Creating annotated tag: ${tag}`);
  run(`git tag -a ${tag} -m "Release ${tag}: JAK Platform"`);

  console.log(`\n🎉 Tag ${tag} created successfully!`);
  console.log(`\nTo trigger the automated GitHub Release workflow, run:`);
  console.log(`   git push origin ${tag}\n`);

} catch (err) {
  console.error('\n❌ Release tagging failed:', err.message || err);
  process.exit(1);
}
