// Main SDK Export file
// This file exports the core SDK functionality

// Re-export BaaS functionality
import { CalendarsApi, DefaultApi } from './generated/baas/api';
import { Configuration } from './generated/baas/configuration';

// Re-export all API methods and types from the generated code
export * from './generated/baas/api';
export * from './generated/baas/models';
export * from './generated/baas/configuration';

// Create and export a single instance of the API clients
const config = new Configuration();
export const calendarsApi = new CalendarsApi(config);
export const defaultApi = new DefaultApi(config);

// Export a convenience function to create a new configuration
export const createConfig = (options?: Partial<Configuration>) => {
  return new Configuration(options);
};

// Re-export MPC functionality
export { MpcClient } from "./mpc";
export * as MpcTools from "./mpc/tools";
export * as MpcTypes from "./mpc/types";

// Export SDK version
export const SDK_VERSION = "0.3.1";
