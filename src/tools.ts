/**
 * MPC Tools Entry Point
 *
 * This file exports all pre-generated MPC tools for the Meeting BaaS SDK.
 */

// Export all tools from the generated directory
// The actual export will be handled by the build process
// This is just a placeholder for development

// Export the registration utilities
export {
  registerTools,
  setupBaasTools,
} from "./tools-generator/register-tools";

// Export the client for convenience
export { BaasClient } from "./generated/baas/api/client";

// Export tool types for TypeScript users
export type { ToolDefinition } from "./mpc/types";

// Mark as a special bundle for MPC tools
export const SDK_MODE = "MPC_TOOLS";

/**
 * Simple example of how to use the MPC tools
 *
 * ```typescript
 * import { registerTools, allTools } from "@meeting-baas/sdk/tools";
 * import { BaasClient } from "@meeting-baas/sdk";
 *
 * // Create a client for making actual API calls
 * const client = new BaasClient({
 *   apiKey: "your-api-key"
 * });
 *
 * // Register all tools with your MPC server
 * registerTools(allTools, (tool) => {
 *   // Your server's registration function
 *   server.registerTool(tool);
 * });
 * ```
 */
