#!/usr/bin/env node
/**
 * Copy generated files script
 *
 * This script copies the generated files to the dist directory
 */

const fs = require("fs");
const path = require("path");

// Paths
const SRC_GENERATED_DIR = path.resolve(__dirname, "../src/generated");
const DIST_GENERATED_DIR = path.resolve(__dirname, "../dist/generated");

// Make sure the dist generated directory exists
if (!fs.existsSync(DIST_GENERATED_DIR)) {
  fs.mkdirSync(DIST_GENERATED_DIR, { recursive: true });
}

// Copy the generated files
function copyGeneratedFiles() {
  console.log("Copying generated files...");

  try {
    // Copy the entire generated directory
    const copyDir = (src, dest) => {
      const entries = fs.readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    copyDir(SRC_GENERATED_DIR, DIST_GENERATED_DIR);
    console.log("Generated files copied successfully");
  } catch (error) {
    console.error("Error copying generated files:", error);
    process.exit(1);
  }
}

copyGeneratedFiles(); 