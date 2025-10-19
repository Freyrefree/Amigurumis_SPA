#!/usr/bin/env node
// Watch images directory and regenerate manifest on changes
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPA_DIR = path.join(ROOT, 'src', 'app', 'assets', 'images', 'spa');

let timer = null;
let running = false;

function generate() {
  if (running) return;
  running = true;
  const p = spawn(process.execPath, [path.join(ROOT, 'tools', 'generate-manifest.mjs')], { stdio: 'inherit' });
  p.on('exit', () => { running = false; });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(generate, 300);
}

console.log('[manifest:watch] Watching', SPA_DIR);
generate();

try {
  fs.watch(SPA_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    // debounce rapid sequences
    schedule();
  });
} catch (err) {
  console.error('[manifest:watch] fs.watch failed:', err.message);
  process.exit(1);
}

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

