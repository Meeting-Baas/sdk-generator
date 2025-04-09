/**
 * Schema Extractor
 *
 * This utility extracts parameter schemas from the generated TypeScript types
 * and converts them to tool parameter definitions and JSON schemas.
 */

import * as MpcTools from "../mpc/tools";
import { CalendarsApi, DefaultApi } from "../generated/baas/api";
import { ParameterDefinition } from "../mpc/types";

interface PropertySchema {
  type: string;
  description?: string;
  required?: boolean;
  enum?: string[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
}

type ApiMethod = keyof DefaultApi | keyof CalendarsApi;

const methodParamSchemas: Record<string, Record<string, ParameterDefinition>> = {
  "DefaultApi.botsWithMetadata": {
    botName: {
      name: "botName",
      description: "Filter bots by name",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots by name"
      }
    },
    createdAfter: {
      name: "createdAfter",
      description: "Filter bots created after this date",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots created after this date"
      }
    },
    createdBefore: {
      name: "createdBefore",
      description: "Filter bots created before this date",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots created before this date"
      }
    },
    cursor: {
      name: "cursor",
      description: "Pagination cursor",
      required: false,
      schema: {
        type: "string",
        description: "Pagination cursor"
      }
    },
    filterByExtra: {
      name: "filterByExtra",
      description: "Filter bots by extra metadata",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots by extra metadata"
      }
    },
    limit: {
      name: "limit",
      description: "Maximum number of bots to return",
      required: false,
      schema: {
        type: "number",
        description: "Maximum number of bots to return"
      }
    },
    meetingUrl: {
      name: "meetingUrl",
      description: "Filter bots by meeting URL",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots by meeting URL"
      }
    },
    sortByExtra: {
      name: "sortByExtra",
      description: "Sort bots by extra metadata",
      required: false,
      schema: {
        type: "string",
        description: "Sort bots by extra metadata"
      }
    },
    speakerName: {
      name: "speakerName",
      description: "Filter bots by speaker name",
      required: false,
      schema: {
        type: "string",
        description: "Filter bots by speaker name"
      }
    }
  },
  "DefaultApi.getMeetingData": {
    meetingId: {
      name: "meetingId",
      description: "The ID of the meeting to get data for",
      required: true,
      schema: {
        type: "string",
        description: "The ID of the meeting to get data for"
      }
    }
  },
  "DefaultApi.join": {
    meetingUrl: {
      name: "meetingUrl",
      description: "The URL of the meeting to join",
      required: true,
      schema: {
        type: "string",
        description: "The URL of the meeting to join"
      }
    },
    displayName: {
      name: "displayName",
      description: "The display name to use in the meeting",
      required: true,
      schema: {
        type: "string",
        description: "The display name to use in the meeting"
      }
    },
    automaticLeave: {
      name: "automaticLeave",
      description: "Configuration for automatic meeting leave",
      required: false,
      schema: {
        type: "object",
        properties: {
          enabled: {
            type: "boolean",
            description: "Whether to enable automatic leave"
          },
          timeoutMinutes: {
            type: "number",
            description: "Minutes to wait before leaving"
          }
        }
      }
    },
    recordingMode: {
      name: "recordingMode",
      description: "Configuration for meeting recording",
      required: false,
      schema: {
        type: "object",
        properties: {
          enabled: {
            type: "boolean",
            description: "Whether to enable recording"
          },
          format: {
            type: "string",
            description: "Recording format",
            enum: ["mp4", "mkv"]
          }
        }
      }
    }
  },
  "DefaultApi.retranscribeBot": {
    botId: {
      name: "botId",
      description: "The ID of the bot to retranscribe",
      required: true,
      schema: {
        type: "string",
        description: "The ID of the bot to retranscribe"
      }
    }
  },
  "CalendarsApi.createCalendar": {
    platform: {
      name: "platform",
      description: "The calendar platform (google or microsoft)",
      required: true,
      schema: {
        type: "string",
        enum: ["google", "microsoft"],
        description: "The calendar platform"
      }
    },
    clientId: {
      name: "clientId",
      description: "OAuth client ID",
      required: true,
      schema: {
        type: "string",
        description: "OAuth client ID"
      }
    },
    clientSecret: {
      name: "clientSecret",
      description: "OAuth client secret",
      required: true,
      schema: {
        type: "string",
        description: "OAuth client secret"
      }
    },
    refreshToken: {
      name: "refreshToken",
      description: "OAuth refresh token",
      required: true,
      schema: {
        type: "string",
        description: "OAuth refresh token"
      }
    }
  }
};

/**
 * Extracts parameter schemas from the generated TypeScript types
 */
export function extractMethodParameters(methodName: string): {
  toolParameters: ParameterDefinition[];
  jsonSchema: Record<string, unknown>;
} {
  const methodSchema = methodParamSchemas[methodName];
  if (!methodSchema) {
    throw new Error(`Method ${methodName} not found in parameter schema mapping`);
  }

  const toolParameters: ParameterDefinition[] = [];
  const jsonSchema: Record<string, unknown> = {
    type: "object",
    properties: {},
    required: []
  };

  for (const [paramName, param] of Object.entries(methodSchema)) {
    toolParameters.push(param);

    const schema: Record<string, unknown> = {
      type: param.schema.type,
      description: param.schema.description
    };

    if (param.schema.type === "object" && param.schema.properties) {
      const properties: Record<string, unknown> = {};
      for (const [propName, prop] of Object.entries(param.schema.properties)) {
        properties[propName] = {
          type: (prop as PropertySchema).type,
          description: (prop as PropertySchema).description
        };
      }
      schema.properties = properties;
    }

    if (param.schema.type === "array" && param.schema.items) {
      const items = param.schema.items as PropertySchema;
      schema.items = {
        type: items.type,
        description: items.description
      };
    }

    if (param.schema.enum) {
      schema.enum = param.schema.enum;
    }

    (jsonSchema.properties as Record<string, unknown>)[paramName] = schema;
    if (param.required) {
      (jsonSchema.required as string[]).push(paramName);
    }
  }

  return { toolParameters, jsonSchema };
}

/**
 * Gets the parameter schema for a given API method
 */
function getMethodSchema(methodName: string): {
  type: string;
  properties: Record<string, PropertySchema>;
  required: string[];
} {
  const schemaMap: Record<string, any> = {
    // DefaultApi methods
    botsWithMetadata: {
      type: "object",
      properties: {
        botName: { type: "string", required: false },
        createdAfter: { type: "string", required: false },
        createdBefore: { type: "string", required: false },
        cursor: { type: "string", required: false },
        filterByExtra: { type: "string", required: false },
        limit: { type: "number", required: false },
        meetingUrl: { type: "string", required: false },
        sortByExtra: { type: "string", required: false },
        speakerName: { type: "string", required: false },
      },
      required: [],
    },
    getMeetingData: {
      type: "object",
      properties: {
        botId: { type: "string", required: true },
      },
      required: ["botId"],
    },
    join: {
      type: "object",
      properties: {
        meetingUrl: { type: "string", required: true },
        displayName: { type: "string", required: true },
        automaticLeave: {
          type: "object",
          properties: {
            enabled: { type: "boolean", required: true },
            timeoutMinutes: { type: "number", required: false },
          },
        },
        recordingMode: {
          type: "object",
          properties: {
            enabled: { type: "boolean", required: true },
            format: { type: "string", enum: ["mp4", "mkv"], required: false },
          },
        },
      },
      required: ["meetingUrl", "displayName"],
    },
    retranscribeBot: {
      type: "object",
      properties: {
        botId: { type: "string", required: true },
      },
      required: ["botId"],
    },

    // CalendarsApi methods
    createCalendar: {
      type: "object",
      properties: {
        platform: { type: "string", enum: ["google", "microsoft"], required: true },
        clientId: { type: "string", required: true },
        clientSecret: { type: "string", required: true },
        refreshToken: { type: "string", required: true },
      },
      required: ["platform", "clientId", "clientSecret", "refreshToken"],
    },
    updateCalendar: {
      type: "object",
      properties: {
        calendarId: { type: "string", required: true },
        platform: { type: "string", enum: ["google", "microsoft"], required: true },
        clientId: { type: "string", required: true },
        clientSecret: { type: "string", required: true },
        refreshToken: { type: "string", required: true },
      },
      required: ["calendarId", "platform", "clientId", "clientSecret", "refreshToken"],
    },
    listRawCalendars: {
      type: "object",
      properties: {
        platform: { type: "string", enum: ["google", "microsoft"], required: true },
        clientId: { type: "string", required: true },
        clientSecret: { type: "string", required: true },
        refreshToken: { type: "string", required: true },
      },
      required: ["platform", "clientId", "clientSecret", "refreshToken"],
    },
    scheduleRecordEvent: {
      type: "object",
      properties: {
        eventId: { type: "string", required: true },
        botConfig: {
          type: "object",
          properties: {
            automaticLeave: {
              type: "object",
              properties: {
                enabled: { type: "boolean", required: true },
                timeoutMinutes: { type: "number", required: false },
              },
            },
            recordingMode: {
              type: "object",
              properties: {
                enabled: { type: "boolean", required: true },
                format: { type: "string", enum: ["mp4", "mkv"], required: false },
              },
            },
          },
        },
        allOccurrences: { type: "boolean", required: false },
      },
      required: ["eventId", "botConfig"],
    },
    patchBot: {
      type: "object",
      properties: {
        eventId: { type: "string", required: true },
        botConfig: {
          type: "object",
          properties: {
            automaticLeave: {
              type: "object",
              properties: {
                enabled: { type: "boolean", required: true },
                timeoutMinutes: { type: "number", required: false },
              },
            },
            recordingMode: {
              type: "object",
              properties: {
                enabled: { type: "boolean", required: true },
                format: { type: "string", enum: ["mp4", "mkv"], required: false },
              },
            },
          },
        },
        allOccurrences: { type: "boolean", required: false },
      },
      required: ["eventId", "botConfig"],
    },
    unscheduleRecordEvent: {
      type: "object",
      properties: {
        eventId: { type: "string", required: true },
        allOccurrences: { type: "boolean", required: false },
      },
      required: ["eventId"],
    },
  };

  return schemaMap[methodName] || {
    type: "object",
    properties: {},
    required: [],
  };
}

/**
 * Helper function to convert camelCase to snake_case
 */
function convertToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
