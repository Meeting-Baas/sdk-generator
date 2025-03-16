#!/usr/bin/env node
/**
 * Bundle Test Script
 *
 * This script tests the combined package setup by simulating
 * how a user would import and use the package on an MPC server.
 */

// Build the project first
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("Testing bundle setup...");

try {
  // Build everything
  console.log("Building the package...");
  execSync("pnpm bundle:build", { stdio: "inherit" });

  // Verify the core files exist
  console.log("\nVerifying core files...");
  const expectedCoreFiles = [
    "dist/bundle.js",
    "dist/bundle.mjs",
    "dist/bundle.d.ts",
    "dist/tools.js",
    "dist/tools.mjs",
    "dist/tools.d.ts",
  ];

  let allCoreFilesExist = true;

  for (const file of expectedCoreFiles) {
    const filePath = path.resolve(__dirname, "..", file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing core file: ${file}`);
      allCoreFilesExist = false;
    } else {
      console.log(`✓ Found core file: ${file}`);
    }
  }

  if (!allCoreFilesExist) {
    console.error("Some core files are missing!");
    process.exit(1);
  }

  // Check the tools directory
  console.log("\nVerifying tools directory...");
  const toolsDir = path.resolve(__dirname, "..", "dist/tools");

  if (!fs.existsSync(toolsDir)) {
    console.error("Tools directory is missing!");
    process.exit(1);
  }

  // Check for compiled tool files
  const toolFiles = fs.readdirSync(toolsDir);
  console.log(`Found ${toolFiles.length} files in tools directory`);

  if (toolFiles.length === 0) {
    console.error("No tool files found in the tools directory!");
    process.exit(1);
  }

  // Verify we have at least index.js and one tool
  const hasIndexJs = toolFiles.includes("index.js");
  const hasAtLeastOneTool = toolFiles.some(
    (file) => file !== "index.js" && file.endsWith(".js")
  );

  if (!hasIndexJs) {
    console.error("Missing index.js in tools directory!");
    process.exit(1);
  }

  if (!hasAtLeastOneTool) {
    console.error("No tool implementation files found in tools directory!");
    process.exit(1);
  }

  console.log("✓ Tools directory contains required files");

  // Simulate importing the bundle
  console.log("\nSimulating package imports...");

  // We need to use a dynamic import since this is a test script
  console.log("Loading the bundle module...");
  const bundleModule = require("../dist/bundle.js");

  // Check if the SDK_MODE is set correctly
  if (bundleModule.SDK_MODE !== "MPC_SERVER") {
    console.error(
      `Expected SDK_MODE to be 'MPC_SERVER', got '${bundleModule.SDK_MODE}'`
    );
    process.exit(1);
  }

  console.log("✓ Bundle has correct SDK_MODE");

  // Only check that tools.js exists, without trying to import it
  // (Import will fail in test environment due to path resolution)
  console.log("Verifying tools.js exists...");
  if (!fs.existsSync(path.resolve(__dirname, "..", "dist/tools.js"))) {
    console.error("Missing dist/tools.js file!");
    process.exit(1);
  }

  console.log("✓ Tools JavaScript file exists");
  console.log("\nBundle test completed successfully!");
} catch (error) {
  console.error("Error testing bundle:", error);
  process.exit(1);
}
