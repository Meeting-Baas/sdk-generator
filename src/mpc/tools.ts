// MPC Tools Registration and Management
import { ParameterDefinition, ToolDefinition } from "./types";

/**
 * Creates a tool definition with proper parameter schema structure
 */
export function createTool(
  name: string,
  description: string,
  parameters: ParameterDefinition[] = [],
  isNotification: boolean = false
): ToolDefinition {
  return {
    name,
    description,
    parameters,
    isNotification,
  };
}

/**
 * Creates a parameter definition for a tool
 */
export function createParameter(
  name: string,
  schema: {
    type: string;
    description?: string;
    format?: string;
    enum?: string[];
    items?: unknown;
    properties?: Record<string, unknown>;
  },
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return {
    name,
    description,
    required,
    schema,
  };
}

/**
 * Creates a string parameter
 */
export function createStringParameter(
  name: string,
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "string", description },
    description,
    required
  );
}

/**
 * Creates a number parameter
 */
export function createNumberParameter(
  name: string,
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "number", description },
    description,
    required
  );
}

/**
 * Creates a boolean parameter
 */
export function createBooleanParameter(
  name: string,
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "boolean", description },
    description,
    required
  );
}

/**
 * Creates an object parameter
 */
export function createObjectParameter(
  name: string,
  properties: Record<string, unknown>,
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "object", properties, description },
    description,
    required
  );
}

/**
 * Creates an array parameter
 */
export function createArrayParameter(
  name: string,
  items: unknown,
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "array", items, description },
    description,
    required
  );
}

/**
 * Creates an enum parameter
 */
export function createEnumParameter(
  name: string,
  values: string[],
  description?: string,
  required: boolean = false
): ParameterDefinition {
  return createParameter(
    name,
    { type: "string", enum: values, description },
    description,
    required
  );
}
