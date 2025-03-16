/**
 * Combined package export file for MPC servers
 *
 * This file exports both the SDK functionality and tools for MPC servers.
 * It provides a simpler interface for use in MPC servers.
 */

// Export everything from the main SDK
export * from "./index";

// Export the tool registration functionality
export { registerTools } from "./tools-generator/register-tools";

// Important:
// MPC tools will be available from '@meeting-baas/sdk/tools' after installation
// e.g., import { join_meeting_tool } from '@meeting-baas/sdk/tools';

// Make the SDK usage mode very explicit
export const SDK_MODE = "MPC_SERVER";
