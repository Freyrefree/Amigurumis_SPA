#!/usr/bin/env node
// Generate manifest.json for images under src/app/assets/images/spa
// Rules:
// - Top-level folders are categories
// - Subfolders with >= 2 images are collections; cover is cover/portada/base if present, else first
// - Loose images directly under category are single-image items

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPA_DIR = path.join(ROOT, 'src', 'app', 'assets', 'images', 'spa');
const MANIFEST_PATH = path.join(SPA_DIR, 'manifest.json');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function isImage(file) {
  return IMG_EXT.has(path.extname(file).toLowerCase());
}

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function encodePath(parts) {
  return parts.map((p) => encodeURIComponent(String(p))).join('/');
}

async function listDirSafe(p) {
  try {
    return await fs.readdir(p, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

function titleize(str) {
  const cleaned = String(str)
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.replace(/\b(\p{L})([^\s]*)/gu, (m, first, rest) => first.toUpperCase() + rest);
}

function isNumericName(name) {
  return /^\d+$/.test(String(name).trim());
}

async function build() {
  const categories = await listDirSafe(SPA_DIR);
  const items = [];

  for (const catEnt of categories) {
    if (!catEnt.isDirectory()) continue;
    const cat = catEnt.name;
    const catPath = path.join(SPA_DIR, cat);

    const entries = await listDirSafe(catPath);
    const subDirs = entries.filter((e) => e.isDirectory());
    const files = entries.filter((e) => e.isFile() && isImage(e.name));

    // Collections in subfolders
    for (const dir of subDirs) {
      const dirPath = path.join(catPath, dir.name);
      const colFiles = (await listDirSafe(dirPath))
        .filter((e) => e.isFile() && isImage(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
      if (colFiles.length === 0) continue;

      const id = slugify(`${cat}-${dir.name}`);
      const nombre = titleize(dir.name);
      if (colFiles.length >= 2) {
        const coverName = colFiles.find((n) => /^(cover|portada|base)\./i.test(n)) || colFiles[0];
        const relCover = encodePath(['assets','images','spa', cat, dir.name, coverName]);
        const galeria = colFiles.map((n) => encodePath(['assets','images','spa', cat, dir.name, n]));
        items.push({ id, nombre, categoria: cat, descripcion: '', imagen: relCover, galeria });
      } else {
        // Treat single-image subfolder as simple item
        const only = colFiles[0];
        const rel = encodePath(['assets','images','spa', cat, dir.name, only]);
        items.push({ id, nombre, categoria: cat, descripcion: '', imagen: rel, galeria: [rel] });
      }
    }

    // Loose images in category root
    files
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
      .forEach((fname, idx) => {
        const rel = encodePath(['assets','images','spa', cat, fname]);
        const base = path.parse(fname).name;
        const id = slugify(`${cat}-${base}`);
        const friendly = isNumericName(base) ? `${cat} ${idx + 1}` : titleize(base);
        items.push({
          id,
          nombre: friendly,
          categoria: cat,
          descripcion: '',
          imagen: rel,
          galeria: [rel],
        });
      });
  }

  // Stable sort by category then name
  items.sort((a, b) => (a.categoria === b.categoria ? a.nombre.localeCompare(b.nombre) : a.categoria.localeCompare(b.categoria)));

  await ensureDir(MANIFEST_PATH);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(items, null, 2), 'utf8');
  console.log(`Manifest generated: ${path.relative(ROOT, MANIFEST_PATH)} (${items.length} items)`);
}

export async function run() { await build(); }

build().catch((err) => {
  console.error('Manifest generation failed:', err);
  process.exit(1);
});
