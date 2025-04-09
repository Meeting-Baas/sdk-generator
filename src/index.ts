// Main SDK Export file
// This file exports the core SDK functionality

// Re-export BaaS functionality
import { CalendarsApi, DefaultApi } from './generated/baas/api';
import { Configuration } from './generated/baas/configuration';
import { BaasClient, BaasClientConfig } from './generated/baas/api/client';

// Re-export all API methods and types from the generated code
export * from './generated/baas/api';
export * from './generated/baas/models';
export * from './generated/baas/configuration';
export { BaasClient, BaasClientConfig };

// Create and export a single instance of the API clients
const config = new Configuration();
export const calendarsApi = new CalendarsApi(config);
export const defaultApi = new DefaultApi(config);

// Export a convenience function to create a new configuration
export const createConfig = (options?: Partial<Configuration>) => {
  return new Configuration(options);
};

// Export a convenience function to create a new BaasClient
export const createClient = (config: BaasClientConfig) => {
  return new BaasClient(config);
};

// Re-export MPC functionality
export { MpcClient } from "./mpc";
export * as MpcTools from "./mpc/tools";
export * as MpcTypes from "./mpc/types";

// Export SDK version
export const SDK_VERSION = "0.3.6";
