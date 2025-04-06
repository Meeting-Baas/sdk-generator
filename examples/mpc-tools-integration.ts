/**
 * Meeting BaaS SDK - MPC Tools Integration Example
 *
 * This example demonstrates how to use the Meeting BaaS SDK's pre-generated MPC tools
 * with a Claude MPC (Multimodal Plugin and Command) server.
 */

// Method 1: Import specific tools
import {
  get_meeting_data_tool,
  join_meeting_tool,
  leave_meeting_tool,
} from "@meeting-baas/sdk/tools";

// Method 2: Import all tools at once
import { allTools, BaasClient, registerTools } from "@meeting-baas/sdk/tools";

// Your MPC server's registration function
// Note: Replace this with your actual MPC server's registration function
async function registerToolWithMpcServer(tool: any) {
  console.log(`Registered tool: ${tool.name}`);
  return Promise.resolve();
}

async function setupMeetingBaasTools() {
  // Initialize the BaaS client (for actual API calls)
  const client = new BaasClient({
    apiKey: process.env.MEETING_BAAS_API_KEY || "your-api-key",
  });

  // Method 1: Register individual tools
  await registerToolWithMpcServer(join_meeting_tool);
  await registerToolWithMpcServer(leave_meeting_tool);
  await registerToolWithMpcServer(get_meeting_data_tool);

  // Method 2: Register all tools at once
  await registerTools(allTools, registerToolWithMpcServer);

  console.log("All Meeting BaaS tools registered successfully");
  return client;
}

// Run the setup function
setupMeetingBaasTools()
  .then((client) => {
    console.log("Setup complete, client ready");
  })
  .catch((error) => {
    console.error("Error setting up Meeting BaaS tools:", error);
  });

/**
 * Example MPC Tool Definitions
 *
 * Each tool follows this format:
 *
 * {
 *   name: "join_meeting",
 *   description: "Join a meeting with a bot",
 *   parameters: {
 *     type: "object",
 *     properties: {
 *       bot_name: { type: "string", description: "Name of the bot" },
 *       meeting_url: { type: "string", description: "URL of the meeting" },
 *       reserved: { type: "boolean", description: "Whether the bot is reserved" }
 *       // ... other parameters
 *     },
 *     required: ["bot_name", "meeting_url", "reserved"]
 *   }
 * }
 */
