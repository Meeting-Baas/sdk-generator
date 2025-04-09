#!/usr/bin/env node
/**
 * Copy generated files script
 *
 * This script copies the generated files to the dist directory
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');

// Paths
const SRC_GENERATED_DIR = path.resolve(__dirname, "../src/generated");
const DIST_GENERATED_DIR = path.resolve(__dirname, "../dist/generated");

// Clean dist directory first
console.log('Cleaning dist directory...');
execSync('rm -rf dist/*', { stdio: 'inherit' });

// Copy generated files to dist/baas
console.log('Copying generated files to dist/baas...');
execSync('mkdir -p dist/baas', { stdio: 'inherit' });
execSync('cp -r src/generated/baas/* dist/baas/', { stdio: 'inherit' });

// Clean up unnecessary files
console.log('Cleaning up unnecessary files...');
const filesToRemove = [
  'dist/baas/README.md',
  'dist/baas/git_push.sh',
  'dist/baas/package.json',
  'dist/baas/tsconfig.json',
  'dist/baas/tsconfig.esm.json'
];

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
});

console.log('Done!'); 