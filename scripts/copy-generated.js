#!/usr/bin/env node
/**
 * Copy generated files script
 *
 * This script copies the generated files to the dist directory
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Starting OpenAPI client compilation...");

// Paths
const SRC_DIR = path.resolve(__dirname, "../src");
const SRC_GENERATED_DIR = path.resolve(SRC_DIR, "generated/baas");
const DIST_DIR = path.resolve(__dirname, "../dist");
const DIST_BAAS_DIR = path.resolve(DIST_DIR, "baas");

// Clean dist directory first
console.log("Cleaning dist directory...");
execSync("rm -rf dist/*", { stdio: "inherit" });

// Check if the generated directory exists
if (!fs.existsSync(SRC_GENERATED_DIR)) {
  console.error(`Error: Generated directory not found at ${SRC_GENERATED_DIR}`);
  console.error("Make sure to run openapi:generate first");
  process.exit(1);
}

// Create a special webpack config for CommonJS compilation
console.log("Creating dist/baas directory...");
execSync(`mkdir -p ${DIST_BAAS_DIR}`, { stdio: "inherit" });

// First, we'll compile the client directly using tsc with outDir option
console.log("Compiling OpenAPI client with tsc...");

// Create a simple package.json for the client in the baas directory
fs.writeFileSync(
  path.join(DIST_BAAS_DIR, "package.json"),
  JSON.stringify(
    {
      name: "@meeting-baas/sdk-internal",
      type: "commonjs",
      private: true,
    },
    null,
    2
  )
);

// Create a simple script to compile the OpenAPI client
const compileScript = `
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure node_modules exists for tsc
if (!fs.existsSync(path.resolve(__dirname, '../node_modules'))) {
  console.log('Creating node_modules symlink...');
  execSync('ln -s ../../node_modules node_modules', { cwd: path.resolve(__dirname) });
}

// Create a temporary tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: "es2020",
    module: "commonjs",
    moduleResolution: "node",
    esModuleInterop: true,
    skipLibCheck: true,
    declaration: true,
    outDir: path.resolve(__dirname, '../dist/baas')
  },
  include: ["src/generated/baas/**/*.ts"]
};

fs.writeFileSync('temp-tsconfig.json', JSON.stringify(tsconfig, null, 2));

try {
  // Compile the TypeScript files
  execSync('npx tsc -p temp-tsconfig.json', { stdio: 'inherit' });
} finally {
  // Clean up
  fs.unlinkSync('temp-tsconfig.json');
  if (fs.existsSync(path.resolve(__dirname, 'node_modules'))) {
    fs.unlinkSync(path.resolve(__dirname, 'node_modules'));
  }
}
`;

const compileScriptPath = path.resolve(__dirname, "compile-openapi.js");
fs.writeFileSync(compileScriptPath, compileScript);

try {
  execSync(`node ${compileScriptPath}`, { stdio: "inherit" });
} catch (error) {
  console.error("Failed to compile OpenAPI client:", error);
  process.exit(1);
} finally {
  fs.unlinkSync(compileScriptPath);
}

console.log("Successfully compiled OpenAPI client!");

// Create .mjs versions for ESM support by copying the .js files and updating
// Path remapping is a safer approach than trying to parse and modify the JS files
console.log("Creating ESM versions (.mjs)...");

function processJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processJsFiles(fullPath);
    } else if (entry.name.endsWith(".js")) {
      // For each .js file, create a .mjs file that re-exports
      const mjsPath = fullPath.replace(".js", ".mjs");
      const relativePath = "./" + entry.name;

      // Create a simple re-export
      fs.writeFileSync(
        mjsPath,
        `export * from ${JSON.stringify(relativePath)};\n`
      );
    } else if (entry.name.endsWith(".d.ts")) {
      // Also create .d.mts files for TypeScript ESM support
      const dmtsPath = fullPath.replace(".d.ts", ".d.mts");
      const relativePath = "./" + entry.name.replace(".d.ts", ".js");

      // Create a simple re-export for types
      fs.writeFileSync(
        dmtsPath,
        `export * from ${JSON.stringify(relativePath)};\n`
      );
    }
  }
}

processJsFiles(DIST_BAAS_DIR);

// Create a warning file to notify users not to import directly from dist/baas
const warningPath = path.resolve(DIST_BAAS_DIR, "WARNING.md");
fs.writeFileSync(
  warningPath,
  `# IMPORTANT: DO NOT IMPORT DIRECTLY FROM THIS DIRECTORY

This directory contains compiled internal modules that should not be imported directly.
Please use the main package entry point instead:

\`\`\`js
// ❌ DO NOT DO THIS
import { Configuration } from '@meeting-baas/sdk/dist/baas/configuration';

// ✅ DO THIS INSTEAD
import { BaasClient } from '@meeting-baas/sdk';
\`\`\`

If you need specific types from this package, they should be re-exported from the main entry point.
`
);

console.log("Done!");
