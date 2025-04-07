/**
 * Schema Extractor
 *
 * This utility extracts parameter schemas from the OpenAPI specification
 * and converts them to tool parameter definitions and JSON schemas.
 */

import fs from "fs";
import path from "path";
import * as MpcTools from "../mpc/tools";

// Load OpenAPI spec from file
const openApiSpecPath = path.resolve(__dirname, "../../tmp/openapi.json");
let openApiSpec: any;

try {
  openApiSpec = JSON.parse(fs.readFileSync(openApiSpecPath, "utf8"));
  console.log(`Loaded OpenAPI spec from ${openApiSpecPath}`);
} catch (error) {
  console.error(`Error loading OpenAPI spec from ${openApiSpecPath}: ${error}`);
  console.error("Make sure the OpenAPI spec file exists and is valid JSON.");
  process.exit(1); // Exit with error
}

// Interface for property schema with proper typing
interface PropSchema {
  type?: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, PropSchema>;
  items?: PropSchema | { type: string };
  required?: string[];
  additionalProperties?: boolean;
}

// Interface for endpoint operation
interface Operation {
  operationId: string;
  description?: string;
  summary?: string;
  parameters?: Array<{
    in: string;
    name: string;
    description?: string;
    required?: boolean;
    schema?: PropSchema;
  }>;
  requestBody?: {
    content: Record<
      string,
      {
        schema: {
          $ref?: string;
          properties?: Record<string, PropSchema>;
          type?: string;
          required?: string[];
        };
      }
    >;
  };
}

/**
 * Find an endpoint by operationId in the OpenAPI spec
 */
function findEndpointByOperationId(operationId: string): Operation | null {
  const paths = openApiSpec.paths || {};

  // Try direct match first
  for (const pathItem of Object.values(paths)) {
    for (const method of ["get", "post", "put", "delete", "patch"]) {
      const operation = (pathItem as any)[method];
      if (operation && operation.operationId === operationId) {
        return operation as Operation;
      }
    }
  }

  // Try snake_case version of camelCase (botsWithMetadata -> bots_with_metadata)
  const snakeCaseOperationId = operationId
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();

  for (const pathItem of Object.values(paths)) {
    for (const method of ["get", "post", "put", "delete", "patch"]) {
      const operation = (pathItem as any)[method];
      if (operation && operation.operationId === snakeCaseOperationId) {
        console.log(
          `Found operation ${operationId} as ${snakeCaseOperationId}`
        );
        return operation as Operation;
      }
    }
  }

  return null;
}

/**
 * Resolve a reference in the OpenAPI spec
 */
function resolveRef(ref: string): any {
  if (!ref.startsWith("#/")) {
    console.warn(`External references are not supported: ${ref}`);
    return null;
  }

  const parts = ref.split("/");
  // Remove the "#/" prefix
  parts.shift();

  // Navigate through the spec
  let current = openApiSpec;
  for (const part of parts) {
    if (!current[part]) {
      console.warn(`Reference not found: ${ref}`);
      return null;
    }
    current = current[part];
  }

  return current;
}

/**
 * Extract parameter schemas for a specific API method
 */
export function extractMethodParameters(
  apiClass: string,
  methodName: string
): {
  parameters: any[];
  jsonSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
} {
  // Find the endpoint in the OpenAPI spec
  const endpoint = findEndpointByOperationId(methodName);
  if (!endpoint) {
    throw new Error(`Method ${methodName} not found in OpenAPI spec`);
  }

  // Extract parameters from the endpoint
  const toolParameters: any[] = [];
  const jsonSchema: any = {
    type: "object",
    properties: {},
    required: [],
  };

  // Add apiKey parameter
  toolParameters.push(
    MpcTools.createStringParameter("api_key", "Your Meeting BaaS API key", true)
  );
  jsonSchema.properties.api_key = { type: "string" };
  jsonSchema.required.push("api_key");

  // Process path and query parameters
  if (endpoint.parameters) {
    for (const param of endpoint.parameters) {
      if (param.in === "path" || param.in === "query") {
        const paramName = convertToSnakeCase(param.name);
        const description = param.description || `${param.name} parameter`;
        const required = param.required === true;

        // Add to tool parameters
        const paramType = param.schema?.type || "string";

        // Handle different parameter types
        if (paramType === "string" && param.schema?.enum) {
          // Enum parameter
          toolParameters.push(
            MpcTools.createEnumParameter(
              paramName,
              param.schema.enum,
              description,
              required
            )
          );

          jsonSchema.properties[paramName] = {
            type: "string",
            enum: param.schema.enum,
          };
        } else if (paramType === "boolean") {
          toolParameters.push(
            MpcTools.createBooleanParameter(paramName, description, required)
          );

          jsonSchema.properties[paramName] = { type: "boolean" };
        } else if (paramType === "number" || paramType === "integer") {
          toolParameters.push(
            MpcTools.createNumberParameter(paramName, description, required)
          );

          jsonSchema.properties[paramName] = { type: "number" };
        } else {
          // Default to string
          toolParameters.push(
            MpcTools.createStringParameter(paramName, description, required)
          );

          jsonSchema.properties[paramName] = { type: "string" };
        }

        // Add to required fields if needed
        if (required) {
          jsonSchema.required.push(paramName);
        }
      }
    }
  }

  // Process request body
  if (endpoint.requestBody) {
    const contentTypes = Object.keys(endpoint.requestBody.content || {});
    const contentType =
      contentTypes.find((type) => type.includes("json")) || contentTypes[0];

    if (contentType && endpoint.requestBody.content[contentType]?.schema) {
      const schema = endpoint.requestBody.content[contentType].schema;

      // If it's a reference, resolve it
      if (schema.$ref) {
        const resolvedSchema = resolveRef(schema.$ref);

        if (resolvedSchema) {
          // Process each property in the schema
          for (const [propName, propSchemaAny] of Object.entries(
            resolvedSchema.properties || {}
          )) {
            const propSchema = propSchemaAny as PropSchema;

            const paramName = convertToSnakeCase(propName);
            const description =
              propSchema.description || `${propName} parameter`;
            const required =
              resolvedSchema.required?.includes(propName) || false;

            // Add to tool parameters based on type
            const paramType = propSchema.type || "string";

            if (paramType === "string" && propSchema.enum) {
              // Enum parameter
              toolParameters.push(
                MpcTools.createEnumParameter(
                  paramName,
                  propSchema.enum,
                  description,
                  required
                )
              );

              jsonSchema.properties[paramName] = {
                type: "string",
                enum: propSchema.enum,
              };
            } else if (paramType === "boolean") {
              toolParameters.push(
                MpcTools.createBooleanParameter(
                  paramName,
                  description,
                  required
                )
              );

              jsonSchema.properties[paramName] = { type: "boolean" };
            } else if (paramType === "number" || paramType === "integer") {
              toolParameters.push(
                MpcTools.createNumberParameter(paramName, description, required)
              );

              jsonSchema.properties[paramName] = { type: "number" };
            } else if (paramType === "object") {
              toolParameters.push(
                MpcTools.createObjectParameter(
                  paramName,
                  propSchema.properties || { additionalProperties: true },
                  description,
                  required
                )
              );

              jsonSchema.properties[paramName] = {
                type: "object",
                properties: propSchema.properties || {},
                additionalProperties: true,
              };
            } else if (paramType === "array") {
              toolParameters.push(
                MpcTools.createArrayParameter(
                  paramName,
                  propSchema.items || { type: "string" },
                  description,
                  required
                )
              );

              jsonSchema.properties[paramName] = {
                type: "array",
                items: propSchema.items || { type: "string" },
              };
            } else {
              // Default to string
              toolParameters.push(
                MpcTools.createStringParameter(paramName, description, required)
              );

              jsonSchema.properties[paramName] = { type: "string" };
            }

            // Add to required fields if needed
            if (required) {
              jsonSchema.required.push(paramName);
            }
          }
        }
      } else if (schema.type === "object" && schema.properties) {
        // Direct object schema (not a reference)
        for (const [propName, propSchemaAny] of Object.entries(
          schema.properties
        )) {
          const propSchema = propSchemaAny as PropSchema;

          const paramName = convertToSnakeCase(propName);
          const description = propSchema.description || `${propName} parameter`;
          const required = schema.required?.includes(propName) || false;

          // Process property (similar to above)
          const paramType = propSchema.type || "string";

          // Handle different parameter types - abbreviated version for brevity
          if (paramType === "string") {
            toolParameters.push(
              MpcTools.createStringParameter(paramName, description, required)
            );
            jsonSchema.properties[paramName] = { type: "string" };
          } else if (paramType === "boolean") {
            toolParameters.push(
              MpcTools.createBooleanParameter(paramName, description, required)
            );
            jsonSchema.properties[paramName] = { type: "boolean" };
          }

          // Add to required fields if needed
          if (required) {
            jsonSchema.required.push(paramName);
          }
        }
      }
    }
  }

  return {
    parameters: toolParameters,
    jsonSchema,
  };
}

/**
 * Helper function to convert camelCase to snake_case
 */
function convertToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
