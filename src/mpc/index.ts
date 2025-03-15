// @mpc.mdc client tools SDK

// MPC Types
import {
  JSONRPC_VERSION,
  LATEST_PROTOCOL_VERSION,
  MpcServerConfig,
  ToolDefinition,
} from "./types";

// MPC Client SDK
export class MpcClient {
  private serverUrl: string;
  private protocolVersion: string;
  private tools: Map<string, ToolDefinition> = new Map();

  /**
   * Creates a new MPC client for tool registration
   * @param config MPC server configuration
   */
  constructor(config: MpcServerConfig) {
    this.serverUrl = config.serverUrl;
    this.protocolVersion = config.protocolVersion || LATEST_PROTOCOL_VERSION;
  }

  /**
   * Registers a tool with the MPC server
   * @param tool Tool definition to register
   * @returns This client instance for chaining
   */
  registerTool(tool: ToolDefinition): this {
    this.tools.set(tool.name, tool);
    return this;
  }

  /**
   * Removes a registered tool
   * @param toolName Name of the tool to remove
   * @returns This client instance for chaining
   */
  unregisterTool(toolName: string): this {
    this.tools.delete(toolName);
    return this;
  }

  /**
   * Generates the JSON-RPC registration payload for all registered tools
   * @returns JSON-RPC tool registration payload
   */
  generateToolsRegistration(): object {
    return {
      jsonrpc: JSONRPC_VERSION,
      method: "rpc.register",
      params: {
        tools: Array.from(this.tools.values()),
        protocolVersion: this.protocolVersion,
      },
    };
  }

  /**
   * Gets all registered tools
   * @returns Array of registered tool definitions
   */
  getRegisteredTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Checks if a tool is registered
   * @param toolName The name of the tool to check
   * @returns Boolean indicating if the tool is registered
   */
  hasRegisteredTool(toolName: string): boolean {
    return this.tools.has(toolName);
  }
}

// Export sub-modules
export * from "./tools";
export * from "./types";
