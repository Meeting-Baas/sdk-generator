# Using Meeting BaaS SDK 0.3.0 with MPC Server

This guide explains how to leverage the pre-generated MPC tools in Meeting BaaS SDK 0.3.0 to simplify your MPC server implementation.

## What's New in 0.3.0

Meeting BaaS SDK 0.3.0 includes **pre-generated MPC tools** for all API endpoints, eliminating the need to manually implement each tool. This significantly simplifies MPC server integration.

## Simplified MPC Server Implementation

Here's how to update your existing implementation:

### 1. Updated `api/tools.ts`

Replace your current manual tool implementations with the pre-generated tools:

```typescript
import { allTools, registerTools } from "@meeting-baas/sdk/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerMeetingTools(
  server: McpServer,
  apiKey: string
): McpServer {
  // Register all pre-generated tools with a single function call
  registerTools(allTools, (tool) => {
    server.registerTool(tool, apiKey);
  });

  return server;
}
```

That's it! No need to manually implement each tool anymore.

### 2. Updated `api/server.ts`

Your server.ts file can remain mostly the same, but you no longer need to define the tool capabilities since they're included with the pre-generated tools:

```typescript
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { registerMeetingTools } from "./tools";

const handler = initializeMcpApiHandler(
  (server, apiKey) => {
    // Register all Meeting BaaS SDK tools with a single function
    server = registerMeetingTools(server, apiKey);
  },
  {
    // No need to manually define tool capabilities - they're included with the tools
  }
);

export default handler;
```

## Tool Names and Import Patterns

The pre-generated tools follow a consistent naming pattern:

```typescript
// Import specific tools
import {
  default_api_join_tool,
  default_api_get_meeting_data_tool,
} from "@meeting-baas/sdk/tools";

// Import all tools
import { allTools } from "@meeting-baas/sdk/tools";
```

Each tool is named according to its API class and method:

- `default_api_join_tool`
- `default_api_get_meeting_data_tool`
- `calendars_api_list_calendars_tool`
- etc.

## Alternative Approach: Direct BaaS Integration

If you need more control, you can combine the pre-generated tools with direct BaaS client integration:

```typescript
import { allTools, setupBaasTools } from "@meeting-baas/sdk/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerMeetingTools(
  server: McpServer,
  apiKey: string
): McpServer {
  // Create client and register tools in one step
  const client = setupBaasTools(
    allTools,
    (tool) => {
      server.registerTool(tool);
    },
    apiKey
  );

  // Add custom tools that use the BaaS client
  server.tool(
    "custom_meeting_tool",
    "A custom tool that uses the BaaS client",
    {
      // Schema using Zod
      meetingName: z.string(),
    },
    async ({ meetingName }) => {
      try {
        // Use the BaaS client directly for custom operations
        const result = await client.someCustomOperation(meetingName);

        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}
```

## Complete Example with Error Handling

Here's a complete example with proper error handling:

```typescript
// api/tools.ts
import { allTools, registerTools, BaasClient } from "@meeting-baas/sdk/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

export function registerMeetingTools(
  server: McpServer,
  apiKey: string
): McpServer {
  // Create a BaaS client for direct use if needed
  const client = new BaasClient({ apiKey });

  // Register all pre-generated tools
  registerTools(allTools, (tool) => {
    try {
      server.registerTool(tool);
      console.log(`Registered tool: ${tool.name}`);
    } catch (error) {
      console.error(`Failed to register tool ${tool.name}:`, error);
    }
  });

  // Add any custom tools if needed
  server.tool(
    "custom_meeting_summary",
    "Summarize meeting data in a specific format",
    {
      meetingId: z.string(),
      includeTranscript: z.boolean().optional(),
    },
    async ({ meetingId, includeTranscript = false }) => {
      try {
        // Use the client directly
        const meetingData = await client.getMeetingData(meetingId);

        // Custom processing
        const summary = {
          title: meetingData.name || "Unknown Meeting",
          duration: meetingData.duration,
          participants: meetingData.speakers,
          transcript: includeTranscript ? meetingData.transcript : null,
        };

        return {
          content: [{ type: "text", text: JSON.stringify(summary) }],
        };
      } catch (error) {
        console.error(`Error in custom_meeting_summary:`, error);
        return {
          content: [
            {
              type: "text",
              text: `Failed to summarize meeting: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
```

## Benefit Summary

By using the pre-generated tools in Meeting BaaS SDK 0.3.0, you:

1. **Eliminate manual tool implementation**: No need to write boilerplate for each API endpoint
2. **Reduce maintenance**: Tool updates automatically when the SDK is updated
3. **Ensure consistency**: All tools follow the same patterns and error handling
4. **Simplify integration**: Single function call to register all tools
5. **Maintain flexibility**: Can still add custom tools when needed

Upgrade to the new version to take advantage of these improvements and simplify your MPC server implementation.

## Leveraging Tool Types and Schemas

In previous versions, you might have manually defined Zod schemas for your tools:

```typescript
import { z } from "zod";

export const toolsSchemas = {
  joinMeeting: {
    parameters: z.object({
      meetingUrl: z.string(),
      botName: z.string(),
      reserved: z.boolean(),
    }),
    required: ["meetingUrl", "botName", "reserved"],
  },
  // Many more manual schema definitions...
};
```

With the Meeting BaaS SDK 0.3.0, this manual work is no longer necessary. You can:

### 1. Access Tool Parameters and Schemas Directly

Each pre-generated tool includes properly defined parameter schemas:

```typescript
import { default_api_join_tool } from "@meeting-baas/sdk/tools";

// Access the tool's parameters schema directly
const joinMeetingParams = default_api_join_tool.parameters;

// Use in your own tool registration if needed
server.tool(
  "my_custom_join",
  "Custom join tool",
  joinMeetingParams, // Re-use the existing schema
  async (params) => {
    // Implementation
  }
);
```

### 2. Use TypeScript Types for Parameters

For TypeScript users, the SDK exports parameter types for all tools:

```typescript
import { ToolParameters } from "@meeting-baas/sdk/tools";

// Use the types directly in your functions
function processJoinRequest(params: ToolParameters["default_api_join"]) {
  const { meeting_url, bot_name, reserved } = params;
  // Implementation with full type safety
}
```

### 3. Extract Schemas Programmatically

You can also extract schemas from all tools at once:

```typescript
import { allTools } from "@meeting-baas/sdk/tools";
import { z } from "zod";

// Extract schemas from all tools
const toolSchemas = Object.fromEntries(
  allTools.map((tool) => [
    tool.name,
    {
      parameters: z.object(
        tool.parameters.reduce((acc, param) => {
          acc[param.name] = param.schema;
          return acc;
        }, {})
      ),
      required: tool.parameters
        .filter((param) => param.required)
        .map((param) => param.name),
    },
  ])
);

// Now you have a structure similar to the manual definition
// but automatically generated from the SDK
```

### 4. Simplest Approach: Register Tools Directly

The simplest approach is to just use the pre-registered tools directly:

```typescript
import { allTools, registerTools } from "@meeting-baas/sdk/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function setupServer(server: McpServer, apiKey: string) {
  // This single line registers all tools with their proper schemas
  registerTools(allTools, (tool) => server.registerTool(tool));

  return server;
}
```

## Importing Considerations

When importing from the SDK, always use the proper paths:

```typescript
// CORRECT - Use the proper export path
import { allTools } from "@meeting-baas/sdk/tools";

// INCORRECT - Don't reference internal paths
// This will fail in production
const { allTools } = require("@meeting-baas/sdk/dist/tools.js");
```

The package.json exports field defines what paths can be imported, and internal paths like `dist/tools.js` are not exposed.

###
