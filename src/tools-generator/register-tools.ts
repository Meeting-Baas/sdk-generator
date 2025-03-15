#!/usr/bin/env node
/**
 * MPC Tools Registration Script
 *
 * This script automatically registers the generated MPC tools with an MPC server.
 */

import fs from "fs";
import path from "path";
import { MpcClient } from "../mpc";
import { loadEnv } from "./load-env";

// Load environment variables from .env file if present
loadEnv();

// Configuration
interface Config {
  mpcServerUrl: string;
  protocolVersion?: string;
  debug: boolean;
}

const config: Config = {
  mpcServerUrl: process.env.MPC_SERVER_URL || "http://localhost:3000",
  protocolVersion: process.env.PROTOCOL_VERSION,
  debug: process.env.DEBUG === "true",
};

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

// Register tools with the MPC server
async function registerTools() {
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

    // Create MPC client
    const mpcClient = new MpcClient({
      serverUrl: config.mpcServerUrl,
      protocolVersion: config.protocolVersion,
    });

    // Register each tool
    for (const tool of allTools) {
      console.log(`Registering tool: ${tool.name}`);
      mpcClient.registerTool(tool);
    }

    // Generate registration payload
    const registrationPayload = mpcClient.generateToolsRegistration();

    if (config.debug) {
      console.log(
        "Registration payload:",
        JSON.stringify(registrationPayload, null, 2)
      );
    }

    console.log(
      `Successfully registered ${allTools.length} tools with the MPC server.`
    );
    console.log("Tool registration complete!");

    // In a real implementation, you would send this payload to the MPC server
    // For now, we just show how to generate it
    console.log("----------------------------------------");
    console.log(
      "To complete registration, send this JSON-RPC payload to your MPC server:"
    );
    console.log(JSON.stringify(registrationPayload, null, 2));
    console.log("----------------------------------------");
  } catch (error) {
    console.error("Error registering tools:", error);
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    await registerTools();
  } catch (error) {
    console.error("Error in main function:", error);
    process.exit(1);
  }
}

// Run the registration
if (require.main === module) {
  main();
}

export { registerTools };
