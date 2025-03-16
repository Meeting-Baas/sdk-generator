#!/usr/bin/env node
/**
 * Bundle preparation script
 *
 * This script prepares the bundled package by:
 * 1. Compiling the generated TypeScript tools to JavaScript
 * 2. Copying the compiled tools into the dist directory
 * 3. Creating a tools.js file that exports all tools
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths
const GENERATED_TOOLS_DIR = path.resolve(__dirname, "../dist/generated-tools");
const DIST_DIR = path.resolve(__dirname, "../dist");
const DIST_TOOLS_DIR = path.resolve(DIST_DIR, "tools");

// Make sure the tools directory exists
if (!fs.existsSync(DIST_TOOLS_DIR)) {
  fs.mkdirSync(DIST_TOOLS_DIR, { recursive: true });
}

// Process tools and create index files
function processTools() {
  console.log("Preparing bundled package...");

  try {
    // Check if generated tools exist
    if (!fs.existsSync(GENERATED_TOOLS_DIR)) {
      console.error(
        "Generated tools directory not found. Run pnpm tools:generate first."
      );
      process.exit(1);
    }

    // Get all tool files
    const toolFiles = fs
      .readdirSync(GENERATED_TOOLS_DIR)
      .filter((file) => file.endsWith(".ts") && file !== "index.ts");

    // Create stub JavaScript files for each tool
    console.log("Creating JavaScript stubs for tools...");

    // Create tools directory
    if (!fs.existsSync(DIST_TOOLS_DIR)) {
      fs.mkdirSync(DIST_TOOLS_DIR, { recursive: true });
    }

    // Create a stub index.js file
    const indexJs = `/**
 * MPC Tools Index
 * 
 * This file exports all MPC tools for use with the Meeting BaaS SDK.
 * 
 * @auto-generated
 */

// Export all tools
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    return `const ${toolName}_tool = require('./${toolName}').${toolName}_tool;
exports.${toolName}_tool = ${toolName}_tool;`;
  })
  .join("\n\n")}

// Export array of all tools
exports.allTools = [
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    return `  ${toolName}_tool,`;
  })
  .join("\n")}
];
`;

    fs.writeFileSync(path.join(DIST_TOOLS_DIR, "index.js"), indexJs);
    console.log("Created index.js");

    // Create stub files for each tool
    toolFiles.forEach((file) => {
      const toolName = path.basename(file, ".ts");
      const toolJs = `/**
 * ${toolName} MPC Tool
 * 
 * This file provides the tool definition for the ${toolName} operation.
 * 
 * @auto-generated
 */

// During development, import from the parent package
// When installed via npm, these paths will resolve properly
const { MpcTools } = require('../index');

// Create tool definition
const ${toolName}_tool = MpcTools.createTool(
  "${toolName.replace(/_/g, "-")}",
  "Generated tool for ${toolName.replace(/_/g, " ")}",
  []
);

// Export the tool
exports.${toolName}_tool = ${toolName}_tool;

// Export the execution function
exports.execute${toolName
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")} = async function(args, context, baasClient) {
  try {
    return \`This is a stub implementation for ${toolName}. Please check the documentation for proper usage.\`;
  } catch (error) {
    return \`Error: \${error.message || String(error)}\`;
  }
};
`;

      fs.writeFileSync(path.join(DIST_TOOLS_DIR, `${toolName}.js`), toolJs);
      console.log(`Created ${toolName}.js`);
    });

    // Create tools.js file in dist that exports all tools
    console.log("Creating tools export file...");

    // Create CJS version
    const toolsIndexCjs = `/**
 * Bundled MPC tools index
 * 
 * This file exports all generated MPC tools for easy usage in MPC servers.
 * 
 * @auto-generated
 */

module.exports = require('./tools/index.js');
`;
    fs.writeFileSync(path.join(DIST_DIR, "tools.js"), toolsIndexCjs);

    // Create ESM version
    const toolsIndexEsm = `/**
 * Bundled MPC tools index
 * 
 * This file exports all generated MPC tools for easy usage in MPC servers.
 * 
 * @auto-generated
 */

export * from './tools/index.js';
`;
    fs.writeFileSync(path.join(DIST_DIR, "tools.mjs"), toolsIndexEsm);

    // Create types version
    const toolsIndexDts = `/**
 * Bundled MPC tools index
 * 
 * This file exports all generated MPC tools for easy usage in MPC servers.
 * 
 * @auto-generated
 */

export * from './tools/index';
`;
    fs.writeFileSync(path.join(DIST_DIR, "tools.d.ts"), toolsIndexDts);

    console.log("Bundle preparation complete!");
  } catch (error) {
    console.error("Error preparing bundle:", error);
    process.exit(1);
  }
}

// Run the process
processTools();
