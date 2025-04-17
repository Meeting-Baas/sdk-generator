#!/usr/bin/env node
/**
 * Copy generated files script
 *
 * This script copies the generated files to the dist directory
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// WARNING! - 2023-12-01
// We've had issues with module resolution when clients try to use dist/baas/* directly.
// Ensure all imports are properly compiled and paths are relative to the compiled output.
// Previously we just copied TS files without proper compilation.

// Paths
const SRC_GENERATED_DIR = path.resolve(__dirname, "../src/generated");
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

// Create tsconfig for compiling just the generated files
const tempTsConfigPath = path.resolve(__dirname, "../temp-tsconfig.json");
fs.writeFileSync(
  tempTsConfigPath,
  JSON.stringify(
    {
      compilerOptions: {
        target: "es2020",
        module: "commonjs",
        moduleResolution: "node",
        declaration: true,
        outDir: DIST_BAAS_DIR,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
      },
      include: ["src/generated/baas/**/*.ts"],
    },
    null,
    2
  )
);

try {
  // Create the output directory
  console.log("Creating output directory...");
  execSync(`mkdir -p ${DIST_BAAS_DIR}`, { stdio: "inherit" });

  // Compile the TypeScript files directly with tsc
  console.log("Compiling generated files with tsc...");
  execSync(`npx tsc -p ${tempTsConfigPath}`, { stdio: "inherit" });

  // Also compile to ESM format
  console.log("Compiling to ESM format...");
  const esmTsConfigPath = path.resolve(__dirname, "../temp-tsconfig-esm.json");
  fs.writeFileSync(
    esmTsConfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: "es2020",
          module: "ESNext",
          moduleResolution: "node",
          declaration: true,
          outDir: DIST_BAAS_DIR,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          skipLibCheck: true,
        },
        include: ["src/generated/baas/**/*.ts"],
      },
      null,
      2
    )
  );

  execSync(`npx tsc -p ${esmTsConfigPath}`, { stdio: "inherit" });

  // Rename .js files to .mjs for ESM format
  const jsFiles = [];
  function findJsFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        findJsFiles(fullPath);
      } else if (file.endsWith(".js")) {
        jsFiles.push(fullPath);
      }
    }
  }

  findJsFiles(DIST_BAAS_DIR);

  for (const jsFile of jsFiles) {
    const content = fs.readFileSync(jsFile, "utf8");
    const mjsFile = jsFile.replace(".js", ".mjs");

    // Convert requires to imports in MJS files
    let esmContent = content
      .replace(
        /const (.*) = require\(['"](.*)['"](?:, ['"](.*)['"])?\);/g,
        (match, variable, module, named) => {
          if (named) {
            return `import { ${named} } from '${module}';`;
          } else {
            return `import ${variable} from '${module}';`;
          }
        }
      )
      .replace(/(?:module\.)?exports\.(.*) = (.*);/g, "export const $1 = $2;")
      .replace(/(?:module\.)?exports = (.*);/g, "export default $1;");

    fs.writeFileSync(mjsFile, esmContent);
  }
} catch (error) {
  console.error("Error compiling generated files:", error);
  process.exit(1);
} finally {
  // Clean up temporary files
  if (fs.existsSync(tempTsConfigPath)) {
    fs.unlinkSync(tempTsConfigPath);
  }
  if (fs.existsSync(path.resolve(__dirname, "../temp-tsconfig-esm.json"))) {
    fs.unlinkSync(path.resolve(__dirname, "../temp-tsconfig-esm.json"));
  }
}

// Clean up unnecessary files
console.log("Cleaning up unnecessary files...");
const filesToRemove = [
  "dist/baas/README.md",
  "dist/baas/git_push.sh",
  "dist/baas/package.json",
  "dist/baas/tsconfig.json",
  "dist/baas/tsconfig.esm.json",
];

filesToRemove.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
});

// Create a warning file to notify users not to import directly from dist/baas
const warningPath = path.resolve(__dirname, "../dist/baas/WARNING.md");
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
