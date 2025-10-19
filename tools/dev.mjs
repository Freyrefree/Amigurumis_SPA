#!/usr/bin/env node
// Run manifest watcher + ng serve in parallel without extra deps
import { spawn } from 'node:child_process';
import path from 'node:path';

function run(cmd, args, name) {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  p.on('exit', (code) => {
    if (code !== 0) process.exitCode = code ?? 1;
  });
  return p;
}

const watcher = run(process.execPath, [path.join('tools', 'watch-manifest.mjs')], 'manifest');
const ng = run('ng', ['serve'], 'serve');

function shutdown() {
  watcher.kill();
  ng.kill();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

