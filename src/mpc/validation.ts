/**
 * MPC Tool Schema Validation Utilities
 */

import { z } from "zod";

/**
 * Convert a JSON Schema to a Zod schema for runtime validation
 *
 * @param jsonSchema JSON Schema object
 * @returns Zod schema for validation
 */
export function jsonSchemaToZod(jsonSchema: any): z.ZodTypeAny {
  if (!jsonSchema) {
    return z.any();
  }

  // Handle different schema types
  switch (jsonSchema.type) {
    case "string":
      let stringSchema: z.ZodTypeAny = z.string();

      // Add enum validation if applicable
      if (jsonSchema.enum) {
        // Check if enum has at least one value
        if (jsonSchema.enum.length > 0) {
          // Create a union of literal strings
          stringSchema = z.enum([
            jsonSchema.enum[0],
            ...jsonSchema.enum.slice(1),
          ] as [string, ...string[]]);
        }
      }

      return stringSchema;

    case "number":
    case "integer":
      let numberSchema = z.number();

      // Add min/max validation if applicable
      if (jsonSchema.minimum !== undefined) {
        numberSchema = numberSchema.min(jsonSchema.minimum);
      }
      if (jsonSchema.maximum !== undefined) {
        numberSchema = numberSchema.max(jsonSchema.maximum);
      }

      return numberSchema;

    case "boolean":
      return z.boolean();

    case "array":
      // Handle array items
      if (jsonSchema.items) {
        return z.array(jsonSchemaToZod(jsonSchema.items));
      }
      return z.array(z.any());

    case "object":
      // Build an object schema based on properties
      if (jsonSchema.properties) {
        const shape: Record<string, z.ZodTypeAny> = {};

        // Create schema for each property
        for (const [key, propSchema] of Object.entries<any>(
          jsonSchema.properties
        )) {
          shape[key] = jsonSchemaToZod(propSchema);
        }

        // Handle required fields
        const objectSchema = z.object(shape);

        // If additionalProperties is true, allow additional fields
        if (jsonSchema.additionalProperties === true) {
          return objectSchema.passthrough();
        }

        return objectSchema;
      }

      // Default object with any properties
      return z.record(z.any());

    default:
      return z.any();
  }
}

/**
 * Validate tool parameters against a schema
 *
 * @param params Parameters to validate
 * @param schema JSON Schema object
 * @returns Validation result with success flag and error details
 */
export function validateParameters(
  params: Record<string, any>,
  schema: any
): { success: boolean; errors?: string[] } {
  try {
    // Convert JSON Schema to Zod schema
    const zodSchema = jsonSchemaToZod(schema);

    // Validate parameters
    zodSchema.parse(params);

    // Validation successful
    return { success: true };
  } catch (error) {
    // Validation failed
    if (error instanceof z.ZodError) {
      // Extract and format error messages
      const errors = error.errors.map((err) => {
        const path = err.path.join(".");
        return `${path}: ${err.message}`;
      });

      return { success: false, errors };
    }

    // Unknown error
    return { success: false, errors: [(error as Error).message] };
  }
}
