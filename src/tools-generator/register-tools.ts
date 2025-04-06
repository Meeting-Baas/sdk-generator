#!/usr/bin/env node
/**
 * MPC Tools Registration Script
 *
 * This script automatically registers the generated MPC tools with an MPC server.
 */

import fs from "fs";
import path from "path";
import { BaasClient } from "../baas/client";
import { ToolDefinition } from "../mpc/types";
import { loadEnv } from "./load-env";

// Load environment variables from .env file if present
loadEnv();

// Configuration
interface Config {
  mpcServerUrl: string;
  protocolVersion?: string;
  debug: boolean;
}

// Default configuration
const config: Config = {
  mpcServerUrl: process.env.MPC_SERVER_URL || "http://localhost:3000",
  protocolVersion: process.env.PROTOCOL_VERSION,
  debug: process.env.DEBUG === "true",
};

/**
 * Register Meeting BaaS SDK tools with any MPC server
 *
 * @param tools Array of tool definitions to register
 * @param registerFn The registration function from your MPC server implementation
 * @returns Promise that resolves when all tools are registered
 */
export async function registerTools(
  tools: ToolDefinition[],
  registerFn: (tool: any) => Promise<void> | void
): Promise<void> {
  if (!tools || tools.length === 0) {
    console.warn("No tools provided for registration");
    return;
  }

  console.log(`Registering ${tools.length} Meeting BaaS tools...`);

  // Register each tool with the provided function
  for (const tool of tools) {
    try {
      await registerFn(tool);
      if (config.debug) {
        console.log(`Registered tool: ${tool.name}`);
      }
    } catch (error) {
      console.error(`Failed to register tool ${tool.name}:`, error);
    }
  }

  console.log("Tool registration complete!");
}

/**
 * Create a Meeting BaaS client and register all tools with an MPC server
 *
 * @param tools Array of tool definitions to register
 * @param registerFn The registration function from your MPC server
 * @param apiKey Meeting BaaS API key
 * @param baseUrl Optional custom base URL for the Meeting BaaS API
 * @returns The BaasClient instance
 */
export function setupBaasTools(
  tools: ToolDefinition[],
  registerFn: (tool: any) => Promise<void> | void,
  apiKey: string,
  baseUrl?: string
): BaasClient {
  // Create the client
  const client = new BaasClient({
    apiKey,
    baseUrl,
  });

  // Register the tools
  registerTools(tools, registerFn).catch((error) => {
    console.error("Error registering tools:", error);
  });

  return client;
}

// Try to dynamically load the generated tools
// This allows us to run the registration even if the tools haven't been generated yet
async function loadGeneratedTools() {
  const toolsDir = path.resolve(__dirname, "../../dist/generated-tools");
  const indexPath = path.join(toolsDir, "index.js");

  if (!fs.existsSync(indexPath)) {
    console.warn(`Generated tools not found at ${indexPath}`);
    console.warn(
      'Please run "pnpm tools:generate" first to generate the tools.'
    );
    return { allTools: [] };
  }

  try {
    // Dynamic import of the generated tools
    const generatedTools = await import(indexPath);
    return generatedTools;
  } catch (error) {
    console.error("Error loading generated tools:", error);
    return { allTools: [] };
  }
}

// Main function to run from CLI
async function main() {
  try {
    console.log(
      `Starting tool registration with MPC server at ${config.mpcServerUrl}...`
    );

    // Load generated tools
    const { allTools } = await loadGeneratedTools();

    if (!allTools || allTools.length === 0) {
      console.error(
        "No tools found to register. Did you run the tools generator?"
      );
      return;
    }

    console.log(`Found ${allTools.length} tools to register`);

    // In CLI mode, just show the tool names and schema
    if (config.debug) {
      for (const tool of allTools) {
        console.log(`Tool: ${tool.name}`);
        console.log(`  Description: ${tool.description}`);
        console.log(
          `  Parameters: ${JSON.stringify(tool.parameters, null, 2)}`
        );
        console.log("-".repeat(40));
      }
    }

    console.log(
      "To use these tools in your MPC server, add this to your code:"
    );
    console.log(`
import { registerTools, allTools } from "@meeting-baas/sdk/tools";
import { BaasClient } from "@meeting-baas/sdk";

// Create a client for making actual API calls
const client = new BaasClient({
  apiKey: "your-api-key"
});

// Register all tools with your MPC server
registerTools(allTools, (tool) => {
  // Your server's registration function
  server.registerTool(tool);
});
    `);
  } catch (error) {
    console.error("Error in main function:", error);
    process.exit(1);
  }
}

// Run the registration if this script is executed directly
if (require.main === module) {
  main();
}
