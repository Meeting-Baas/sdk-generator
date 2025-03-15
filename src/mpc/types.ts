// Types for MPC SDK

export type ProgressToken = string | number;
export type Cursor = string;

// JSON-RPC Types
export interface Request {
  method: string;
  params?: {
    _meta?: {
      progressToken?: ProgressToken;
    };
    [key: string]: unknown;
  };
}

export interface Notification {
  method: string;
  params?: {
    _meta?: { [key: string]: unknown };
    [key: string]: unknown;
  };
}

export interface Result {
  _meta?: { [key: string]: unknown };
  [key: string]: unknown;
}

export interface JSONRPCRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: unknown;
}

export interface JSONRPCNotification {
  jsonrpc: string;
  method: string;
  params?: unknown;
}

export interface JSONRPCResponse {
  jsonrpc: string;
  id: string | number;
  result: unknown;
}

export interface JSONRPCError {
  jsonrpc: string;
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export type JSONRPCMessage =
  | JSONRPCRequest
  | JSONRPCNotification
  | JSONRPCResponse
  | JSONRPCError;

// Tool Definition Types
export interface ParameterDefinition {
  name: string;
  description?: string;
  required?: boolean;
  schema: {
    type: string;
    description?: string;
    format?: string;
    enum?: string[];
    items?: unknown;
    properties?: Record<string, unknown>;
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: ParameterDefinition[];
  isNotification?: boolean;
}

export interface MpcServerConfig {
  serverUrl: string;
  protocolVersion?: string;
}

export const LATEST_PROTOCOL_VERSION = "2024-11-05";
export const JSONRPC_VERSION = "2.0";
