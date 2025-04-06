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
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `const ${safeVarName}_tool = require('./${toolName}').${safeVarName}_tool;
exports.${safeVarName}_tool = ${safeVarName}_tool;`;
  })
  .join("\n\n")}

// Export array of all tools
exports.allTools = [
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `  ${safeVarName}_tool,`;
  })
  .join("\n")}
];
`;

    fs.writeFileSync(path.join(DIST_TOOLS_DIR, "index.js"), indexJs);
    console.log("Created index.js");

    // Create stub files for each tool
    toolFiles.forEach((file) => {
      const toolName = path.basename(file, ".ts");
      // Replace dots with underscores for valid JS identifiers
      const safeVarName = toolName.replace(/\./g, "_");

      // Create a valid camelCase function name for the execute function
      const parts = safeVarName.split("_");
      const functionName =
        parts[0] +
        parts
          .slice(1)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");

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
const ${safeVarName}_tool = MpcTools.createTool(
  "${toolName.replace(/_/g, "-")}",
  "Generated tool for ${toolName.replace(/_/g, " ")}",
  []
);

// Export the tool
exports.${safeVarName}_tool = ${safeVarName}_tool;

// Export the execution function
exports.execute${functionName} = async function(args, context, baasClient) {
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

// Export all tools from the tools directory
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `const ${safeVarName}_tool = require('./tools/${toolName}').${safeVarName}_tool;
exports.${safeVarName}_tool = ${safeVarName}_tool;`;
  })
  .join("\n\n")}

// Export allTools array for convenience
exports.allTools = [
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `  ${safeVarName}_tool,`;
  })
  .join("\n")}
];

// Export utility functions for tool registration
exports.registerTools = require('./bundle').registerTools;
exports.setupBaasTools = require('./bundle').setupBaasTools;
exports.BaasClient = require('./index').BaasClient;
exports.SDK_MODE = "MPC_TOOLS";

// Export helper functions
exports.getToolByName = function(name) {
  return exports.allTools.find(tool => tool.name === name);
};

exports.registerAllTools = async function(registerFn, apiKey) {
  for (const tool of exports.allTools) {
    try {
      await registerFn(tool);
    } catch (error) {
      console.error(\`Failed to register tool \${tool.name}:\`, error);
    }
  }
};
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

// Export all tools from the tools directory
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `export { ${safeVarName}_tool } from './tools/${toolName}';`;
  })
  .join("\n")}

// Export allTools array for convenience
export const allTools = [
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `  ${safeVarName}_tool,`;
  })
  .join("\n")}
];

// Export utility functions for tool registration
export { registerTools, setupBaasTools } from './bundle';
export { BaasClient } from './index';
export const SDK_MODE = "MPC_TOOLS";

// Export helper functions
export function getToolByName(name) {
  return allTools.find(tool => tool.name === name);
}

export async function registerAllTools(registerFn, apiKey) {
  for (const tool of allTools) {
    try {
      await registerFn(tool);
    } catch (error) {
      console.error(\`Failed to register tool \${tool.name}:\`, error);
    }
  }
}
`;
    fs.writeFileSync(path.join(DIST_DIR, "tools.mjs"), toolsIndexEsm);

    // Create TypeScript definitions
    const toolsIndexDts = `/**
 * Bundled MPC tools index
 * 
 * This file exports all generated MPC tools for easy usage in MPC servers.
 * 
 * @auto-generated
 */

import { ToolDefinition } from './index';
import { BaasClient } from './index';

// Export all tools
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `export declare const ${safeVarName}_tool: ToolDefinition;`;
  })
  .join("\n")}

// Export allTools array for convenience
export declare const allTools: ToolDefinition[];

// Export utility functions for tool registration
export declare function registerTools(
  tools: ToolDefinition[],
  registerFn: (tool: any) => Promise<void> | void
): Promise<void>;

export declare function setupBaasTools(
  tools: ToolDefinition[],
  registerFn: (tool: any) => Promise<void> | void,
  apiKey: string,
  baseUrl?: string
): BaasClient;

export { BaasClient };
export declare const SDK_MODE: string;

// Export helper functions
export declare function getToolByName(name: string): ToolDefinition | undefined;
export declare function registerAllTools(
  registerFn: (tool: ToolDefinition) => Promise<void> | void,
  apiKey?: string
): Promise<void>;

// Export parameter types for TypeScript users
export declare type ToolParameters = {
  ${toolFiles
    .map((file) => {
      const toolName = path.basename(file, ".ts");
      return `'${toolName}': Parameters<typeof ${toolName}_tool.handler>[0];`;
    })
    .join("\n  ")}
};
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
