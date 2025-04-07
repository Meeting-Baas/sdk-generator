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

// Export all tools and schemas
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `const ${safeVarName}_tool = require('./${toolName}').${safeVarName}_tool;
exports.${safeVarName}_tool = ${safeVarName}_tool;
const ${safeVarName}_schema = require('./${toolName}').${safeVarName}_schema;
exports.${safeVarName}_schema = ${safeVarName}_schema;`;
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

// Export map of all schemas
exports.allSchemas = {
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    const displayName = toolName.replace(/_/g, "-");
    return `  "${displayName}": ${safeVarName}_schema,`;
  })
  .join("\n")}
};

// Export helper functions
exports.getToolByName = function(name) {
  return exports.allTools.find(tool => tool.name === name);
};

exports.getSchemaByName = function(name) {
  return exports.allSchemas[name];
};
`;

    fs.writeFileSync(path.join(DIST_TOOLS_DIR, "index.js"), indexJs);
    console.log("Created index.js");

    // Create stub files for each tool
    toolFiles.forEach((file) => {
      const toolName = path.basename(file, ".ts");
      // Replace dots with underscores for valid JS identifiers
      const safeVarName = toolName.replace(/\./g, "_");

      // Read the TypeScript file to extract parameter definitions
      const tsFilePath = path.join(GENERATED_TOOLS_DIR, file);
      const tsContent = fs.readFileSync(tsFilePath, "utf8");

      // Extract parameters array from the file
      const paramsMatch = tsContent.match(
        /createTool\s*\(\s*["'][-\w]+["']\s*,\s*["'].*?["']\s*,\s*\[([\s\S]*?)\]\s*\)/
      );
      let parametersCode = "[]"; // Default empty array
      if (paramsMatch && paramsMatch[1]) {
        parametersCode = `[${paramsMatch[1]}]`;
      }

      // Extract parameter names and required status for schema generation
      const paramNameRegex = /create\w+Parameter\s*\(\s*["']([^"']+)["']/g;
      const paramRequiredRegex =
        /create\w+Parameter\s*\(\s*["'][^"']+["'][^,]*,[^,]*,[^,]*,\s*(true|false)/g;

      const paramNames = [];
      const requiredParams = [];

      // Extract parameter names
      let match;
      while ((match = paramNameRegex.exec(tsContent)) !== null) {
        paramNames.push(match[1]);
      }

      // Extract required status
      let requiredIndex = 0;
      while ((match = paramRequiredRegex.exec(tsContent)) !== null) {
        if (match[1] === "true" && requiredIndex < paramNames.length) {
          requiredParams.push(paramNames[requiredIndex]);
        }
        requiredIndex++;
      }

      // Ensure we have at least the api_key parameter
      if (paramNames.length === 0) {
        paramNames.push("api_key");
      }
      if (requiredParams.length === 0) {
        requiredParams.push("api_key");
      }

      // Build properties for schema
      const schemaProperties = {};
      paramNames.forEach((name) => {
        schemaProperties[name] = { type: "string" };
      });

      // Special cases for default_api tools
      const specialCases = {
        default_api_join: {
          params: ["api_key", "meeting_url", "bot_name", "reserved"],
          types: { reserved: "boolean" },
        },
        default_api_get_meeting_data: {
          params: ["api_key", "bot_id"],
          types: {},
        },
        default_api_delete_data: {
          params: ["api_key", "bot_id"],
          types: {},
        },
        default_api_leave: {
          params: ["api_key", "bot_id"],
          types: {},
        },
        calendars_api_schedule_record_event: {
          params: ["api_key", "event_uuid", "bot_name", "all_occurrences"],
          types: { all_occurrences: "boolean" },
        },
      };

      // Check if this tool needs special handling
      if (specialCases[toolName]) {
        const caseInfo = specialCases[toolName];

        // Add any missing parameters
        for (const param of caseInfo.params) {
          if (!paramNames.includes(param)) {
            const type = caseInfo.types[param] || "string";
            schemaProperties[param] = { type };
          }

          // Ensure they're marked as required
          if (!requiredParams.includes(param)) {
            requiredParams.push(param);
          }
        }

        console.log(`Added special handling for ${toolName}`);
      }

      // Override with existing schema if available
      let schemaObject = {
        type: "object",
        properties: schemaProperties,
        required: requiredParams,
      };

      // Extract the schema definition from the file
      const schemaMatch = tsContent.match(
        /const\s+jsonSchema\s*=\s*({[\s\S]*?});/
      );

      // Try to use the schema from the file if it exists
      if (schemaMatch && schemaMatch[1]) {
        try {
          // This is a safe way to evaluate the schema object
          const extractedSchema = eval(`(${schemaMatch[1]})`);

          // Override our generated schema with the extracted one
          schemaObject = extractedSchema;
          console.log(`Found schema in file for ${toolName}`);
        } catch (error) {
          console.warn(`Error parsing schema for ${toolName}: ${error}`);
        }
      }

      // Format the schema as a string for inclusion in the JS file
      const schemaPropsStr = JSON.stringify(schemaObject.properties, null, 2)
        .replace(/"([^"]+)":/g, "$1:") // Convert "name": to name:
        .replace(/^{/, "{\n    ") // Add indent after opening brace
        .replace(/}$/, "\n  }") // Add indent before closing brace
        .replace(/\n/g, "\n    "); // Add additional indent to all lines

      // Format required fields array
      const requiredFieldsStr = JSON.stringify(
        schemaObject.required || [],
        null,
        2
      )
        .replace(/\[/, "[\n    ") // Add indent after opening bracket
        .replace(/\]/, "\n  ]") // Add indent before closing bracket
        .replace(/\n/g, "\n    ") // Add additional indent to all lines
        .replace(/",/g, '",\n    '); // Add newline after each entry

      // Create a stub for tool definition
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
  ${parametersCode}
);

// Create schema for validation
const ${safeVarName}_schema = {
  type: "object",
  properties: ${schemaPropsStr},
  required: ${requiredFieldsStr}
};

// Export the tool and schema
exports.${safeVarName}_tool = ${safeVarName}_tool;
exports.${safeVarName}_schema = ${safeVarName}_schema;

// Export the execution function
exports.execute${
        safeVarName.charAt(0).toUpperCase() + safeVarName.slice(1)
      } = async function(args, context, baasClient) {
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

// Export all tools and schemas from the tools directory
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `const ${safeVarName}_tool = require('./tools/${toolName}').${safeVarName}_tool;
exports.${safeVarName}_tool = ${safeVarName}_tool;
const ${safeVarName}_schema = require('./tools/${toolName}').${safeVarName}_schema;
exports.${safeVarName}_schema = ${safeVarName}_schema;`;
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

// Export allSchemas map for validation
exports.allSchemas = {
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    const displayName = toolName.replace(/_/g, "-");
    return `  "${displayName}": ${safeVarName}_schema,`;
  })
  .join("\n")}
};

// Export utility functions for tool registration
exports.registerTools = require('./bundle').registerTools;
exports.setupBaasTools = require('./bundle').setupBaasTools;
exports.BaasClient = require('./index').BaasClient;
exports.SDK_MODE = "MPC_TOOLS";

// Export helper functions
exports.getToolByName = function(name) {
  return exports.allTools.find(tool => tool.name === name);
};

exports.getSchemaByName = function(name) {
  return exports.allSchemas[name];
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

// Export all tools and schemas from the tools directory
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `export { ${safeVarName}_tool, ${safeVarName}_schema } from './tools/${toolName}';`;
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

// Export allSchemas map for validation
export const allSchemas = {
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    const displayName = toolName.replace(/_/g, "-");
    return `  "${displayName}": ${safeVarName}_schema,`;
  })
  .join("\n")}
};

// Export utility functions for tool registration
export { registerTools, setupBaasTools } from './bundle';
export { BaasClient } from './index';
export const SDK_MODE = "MPC_TOOLS";

// Export helper functions
export function getToolByName(name) {
  return allTools.find(tool => tool.name === name);
}

export function getSchemaByName(name) {
  return allSchemas[name];
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

// Export all tools and schemas
${toolFiles
  .map((file) => {
    const toolName = path.basename(file, ".ts");
    // Replace dots with underscores for valid JS identifiers
    const safeVarName = toolName.replace(/\./g, "_");
    return `export declare const ${safeVarName}_tool: ToolDefinition;
export declare const ${safeVarName}_schema: {
  type: string;
  properties: Record<string, any>;
  required: string[];
};`;
  })
  .join("\n\n")}

// Export allTools array for convenience
export declare const allTools: ToolDefinition[];

// Export allSchemas map for validation
export declare const allSchemas: Record<string, {
  type: string;
  properties: Record<string, any>;
  required: string[];
}>;

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
export declare function getSchemaByName(name: string): any;
export declare function registerAllTools(
  registerFn: (tool: ToolDefinition) => Promise<void> | void,
  apiKey?: string
): Promise<void>;

// Export parameter types for TypeScript users
export declare type ToolParameters = {
  ${toolFiles
    .map((file) => {
      const toolName = path.basename(file, ".ts");
      const displayName = toolName.replace(/_/g, "-");
      return `'${displayName}': any; // Parameters for ${toolName}`;
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
