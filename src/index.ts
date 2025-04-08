// Main SDK Export file
// This file exports the core SDK functionality

// Re-export BaaS functionality
export { BaasClient } from "./generated/baas/api/client";
export * as BaasTypes from "./generated/baas/models";

// Re-export MPC functionality
export { MpcClient } from "./mpc";
export * as MpcTools from "./mpc/tools";
export * as MpcTypes from "./mpc/types";

// Export SDK version
export const SDK_VERSION = "0.3.1";
