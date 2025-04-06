#!/usr/bin/env node
/**
 * MPC Tools Generator
 *
 * This script automatically generates MPC tool definitions from the SDK methods,
 * using Anthropic's API to help with the conversion.
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import {
  CalendarsApi,
  Configuration,
  DefaultApi,
  WebhooksApi,
} from "../generated/baas";
import { loadEnv } from "./load-env";

// Load environment variables from .env file if present
loadEnv();

// Configuration
interface Config {
  anthropicApiKey: string;
  outputDir: string;
  debug: boolean;
  model: string;
}

const config: Config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  outputDir: path.resolve(__dirname, "../../dist/generated-tools"),
  debug: process.env.DEBUG === "true",
  model: process.env.MODEL || "claude-3-sonnet-20240229",
};

// Get method information from a class
function getClassMethods(instance: any): string[] {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(
    (name) => name !== "constructor" && typeof instance[name] === "function"
  );
}

// Extract method information directly from source code
function getMethodInfo(methodName: string): string {
  try {
    // Read the client file directly
    const clientPath = path.resolve(__dirname, "../baas/client.ts");
    const clientSource = fs.readFileSync(clientPath, "utf-8");

    // Simple regex to find the method and its JSDoc
    const methodPattern = new RegExp(
      `\\/\\*\\*[\\s\\S]*?\\*\\/\\s*async\\s+${methodName}\\s*\\([\\s\\S]*?\\)\\s*:[\\s\\S]*?{[\\s\\S]*?}`,
      "g"
    );

    const match = methodPattern.exec(clientSource);
    if (match && match[0]) {
      return match[0];
    }

    // Fallback: Try to find just the method signature
    const signaturePattern = new RegExp(
      `async\\s+${methodName}\\s*\\([\\s\\S]*?\\)\\s*:[\\s\\S]*?{`,
      "g"
    );

    const signatureMatch = signaturePattern.exec(clientSource);
    if (signatureMatch && signatureMatch[0]) {
      return signatureMatch[0];
    }

    return `Method ${methodName} not found in client source`;
  } catch (error) {
    console.error(`Error extracting info for method ${methodName}:`, error);
    return `Failed to extract info for ${methodName}`;
  }
}

// Try to extract API endpoint information
function getEndpointInfo(methodName: string): string {
  try {
    // We can add logic here to map method names to OpenAPI endpoints
    // This would provide more context to the AI about the specific API details

    // Read one of the generated API files to find information
    const apiFiles = [
      "src/generated/baas/api/default-api.ts",
      "src/generated/baas/api/calendars-api.ts",
      "src/generated/baas/api/webhooks-api.ts",
    ];
    let endpointInfo = "";

    for (const apiFile of apiFiles) {
      if (fs.existsSync(apiFile)) {
        const apiSource = fs.readFileSync(apiFile, "utf-8");
        // Look for sections describing the endpoint related to this method
        const methodPattern = new RegExp(
          `\\*\\s+@summary.*?\\s+${methodName
            .replace(/([A-Z])/g, "\\$1")
            .toLowerCase()}.*?\\s+@param`,
          "is"
        );
        const match = methodPattern.exec(apiSource);
        if (match && match[0]) {
          endpointInfo = match[0];
          break;
        }
      }
    }

    return endpointInfo || "No endpoint info found";
  } catch (error) {
    console.error(
      `Error extracting endpoint info for method ${methodName}:`,
      error
    );
    return `Failed to extract endpoint info for ${methodName}`;
  }
}

// Generate simple stub tool definition without Anthropic API
function generateSimpleStubToolDefinition(methodName: string): string {
  // Get method info to better understand parameters
  const methodInfo = getMethodInfo(methodName);

  // This function creates a simple stub tool without calling the Anthropic API
  // Useful for testing or when an API key isn't available

  // Convert camelCase to snake_case for the tool name
  const toolName = methodName
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");

  return `
/**
 * Tool definition for ${methodName}
 * 
 * This is a stub tool generated without the Anthropic API.
 * Replace with a proper implementation or regenerate with an API key.
 * 
 * Original method:
 * ${methodInfo
   .split("\n")
   .map((line) => ` * ${line}`)
   .join("\n")}
 */
export const ${toolName}_tool: ToolDefinition = MpcTools.createTool(
  '${toolName}',
  'Stub tool for ${methodName} method',
  [
    // Define parameters here based on the method signature
    MpcTools.createStringParameter(
      'api_key', 
      'API key for the BaaS API',
      true
    ),
  ]
);

/**
 * Execution function for the ${toolName} tool
 */
export async function execute${
    methodName.charAt(0).toUpperCase() + methodName.slice(1)
  }(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a BaaS client with the provided API key
    const client = new BaasClient({
      apiKey: args.api_key
    });
    
    // Call the method (you'll need to implement the proper parameter mapping)
    // const result = await client.${methodName}(...);
    
    return 'This is a stub implementation. Please provide an Anthropic API key to generate a proper tool.';
  } catch (error) {
    return \`Error: \${error instanceof Error ? error.message : String(error)}\`;
  }
}
  `.trim();
}

// Generate tool definition using Anthropic API
async function generateToolDefinition(
  methodName: string,
  exampleTools: string
): Promise<string> {
  // Get method info to provide to the LLM
  const methodInfo = getMethodInfo(methodName);
  const endpointInfo = getEndpointInfo(methodName);

  // If no API key available, generate a stub tool instead
  if (!config.anthropicApiKey) {
    console.warn("No Anthropic API key found. Generating a stub tool instead.");
    return generateSimpleStubToolDefinition(methodName);
  }

  // Provide context about the Meeting BaaS API and its endpoints
  const apiContext = `
Meeting BaaS API Overview:
- Unified API for Google Meet, Zoom, and Microsoft Teams
- Provides access to 13 endpoints for bot management and calendar integration
- Includes features like meeting recording, transcription, and calendar sync
- Supports both direct meeting interaction and scheduled recordings via calendars

The SDK wraps the following main API categories:
1. Bot Management (DefaultApi):
   - Join meetings with customizable bot parameters
   - Leave meetings and clean up resources
   - Get recording data and transcripts
   - Delete meeting data for privacy compliance
   - List bots with metadata and filtering options
   - Retranscribe audio with different providers

2. Calendar Integration (CalendarsApi):
   - List and integrate calendars from Google and Microsoft
   - Create, update, and delete calendar connections 
   - List and filter calendar events
   - Get detailed event information
   - Schedule recordings for specific events or recurring series
   - Update bot configurations for scheduled recordings
   
3. Webhooks Documentation (WebhooksApi):
   - Get documentation about webhook events
   - Understand bot webhook event formats
   - Learn about calendar webhook notifications
`;

  const prompt = `
You are a TypeScript expert who converts SDK methods into MPC tool definitions, with a focus on user-friendly and flexible tool creation.

${apiContext}

Given the following SDK method:

METHOD NAME: ${methodName}
METHOD INFO:
${methodInfo}

ENDPOINT INFO:
${endpointInfo}

And these example MPC tools:
${exampleTools}

Create one or more MPC tool definitions that wrap this SDK method. Consider the following approaches:

1. FULL TOOL: Create a comprehensive tool with all parameters (both required and optional)
   - Best for power users who want full control
   - Includes all possible parameters with clear descriptions
   - Example: join_meeting_tool with all options

2. SIMPLE TOOL: Create a streamlined version with only essential parameters
   - Best for common use cases
   - Focuses on the most frequently used parameters
   - Example: join_meeting_simple_tool with just meeting_url and bot_name

3. SPECIALIZED TOOLS: Create separate tools for specific use cases
   - Break down complex methods into focused tools
   - Each tool handles a specific scenario
   - Examples:
     * join_meeting_with_recording_tool (for recording-focused use)
     * join_meeting_with_transcription_tool (for transcription-focused use)
     * join_meeting_with_custom_bot_tool (for custom bot configuration)

4. SEARCH/QUERY TOOLS: For endpoints with complex filtering/search capabilities
   - Create focused tools for specific search scenarios
   - Examples for /bots/bots_with_metadata:
     * search_bots_by_name_tool (filter by bot_name)
     * search_bots_by_date_tool (filter by created_after/created_before)
     * search_bots_by_extra_tool (filter by extra JSON payload)
     * search_bots_by_meeting_url_tool (filter by meeting URL)
   - Examples for /bots/meeting_data:
     * search_transcript_by_speaker_tool (find specific speaker)
     * search_transcript_by_time_tool (find content in time range)
     * search_transcript_by_text_tool (find specific text)

IMPORTANT: Sometimes a single tool is the best approach:
- For simple endpoints with few parameters
- When the parameters are tightly coupled
- When creating multiple tools would add unnecessary complexity
- For endpoints that are always used together

For each tool definition:
1. Use descriptive names that clearly indicate the tool's purpose
2. Convert camelCase to snake_case for tool names
3. Include clear descriptions of what the tool does
4. Define parameters with proper types and descriptions
5. Handle parameter conversions between snake_case (tool) and camelCase (SDK)
6. Format responses to be human-readable
7. Include proper error handling with specific messages
8. Use the BaasClient instance provided

Naming and Formatting Conventions:
- Tool names: snake_case (e.g., join_meeting_with_recording)
- Parameters: snake_case (e.g., meeting_url, bot_name)
- SDK methods: camelCase (e.g., joinMeeting)
- Enum values: match API specifications exactly
- Required parameters: clearly marked as required
- Response formatting: human-readable for AI assistant context

Example Tool Structure:
1. Full Tool:
   join_meeting_tool: All parameters, maximum flexibility
   
2. Simple Tool:
   join_meeting_simple_tool: Essential parameters only
   
3. Specialized Tools:
   join_meeting_with_recording_tool: Focused on recording setup
   join_meeting_with_transcription_tool: Focused on transcription setup

4. Search/Query Tools:
   search_bots_by_name_tool: Focused on name-based search
   search_bots_by_date_tool: Focused on date-based filtering
   search_transcript_by_speaker_tool: Focused on speaker search

Respond ONLY with valid TypeScript code for the tool definition(s), with no explanation or additional text.
Use the MpcTools helper functions like createTool, createStringParameter, etc.
`;

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: config.model,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.anthropicApiKey,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    if (config.debug) {
      console.log(
        "Anthropic API Response:",
        JSON.stringify(response.data, null, 2)
      );
    }

    // Extract the code from the response
    const content = response.data.content[0].text;

    // Clean up the code (remove markdown code blocks if present)
    let code = content.trim();
    if (code.startsWith("```") && code.endsWith("```")) {
      code = code
        .substring(code.indexOf("\n") + 1, code.lastIndexOf("```"))
        .trim();
    }

    return code;
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    console.warn("Falling back to generating a stub tool...");
    return generateSimpleStubToolDefinition(methodName);
  }
}

// Load example tools from file
async function loadExampleTools(): Promise<string> {
  return fs.readFileSync(
    path.resolve(__dirname, "./example-tool-templates.ts"),
    "utf-8"
  );
}

// Generate all tool definitions
async function generateAllToolDefinitions(): Promise<Record<string, string>> {
  const config = new Configuration({ apiKey: "dummy-key" });
  const defaultApi = new DefaultApi(config);
  const calendarsApi = new CalendarsApi(config);
  const webhooksApi = new WebhooksApi(config);

  // Get methods from each API
  const botsMethods = getClassMethods(defaultApi).filter(
    (method) => !method.startsWith("_")
  );
  const calendarsMethods = getClassMethods(calendarsApi).filter(
    (method) => !method.startsWith("_")
  );
  const webhooksMethods = getClassMethods(webhooksApi).filter(
    (method) => !method.startsWith("_")
  );

  // Combine all methods
  const allMethods = [
    ...botsMethods.map((m) => `DefaultApi.${m}`),
    ...calendarsMethods.map((m) => `CalendarsApi.${m}`),
    ...webhooksMethods.map((m) => `WebhooksApi.${m}`),
  ];

  // Get example tools for reference
  const exampleTools = await loadExampleTools();

  const toolDefinitions: Record<string, string> = {};

  console.log(`Found ${allMethods.length} methods to convert to MPC tools`);

  for (const method of allMethods) {
    console.log(`Generating tool definition for ${method}...`);
    const toolCode = await generateToolDefinition(method, exampleTools);
    toolDefinitions[method] = toolCode;
  }

  return toolDefinitions;
}

// Write tool definitions to files
async function writeToolDefinitions(
  toolDefinitions: Record<string, string>
): Promise<void> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // Write each tool definition to a separate file
  for (const [method, code] of Object.entries(toolDefinitions)) {
    const fileName = method
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
    const filePath = path.join(config.outputDir, `${fileName}.ts`);

    // Add necessary imports at the top of each file - using proper SDK imports
    const fileContent = `
/**
 * Auto-generated MPC tool for the BaaS SDK method: ${method}
 * DO NOT EDIT DIRECTLY - Regenerate using the tools generator
 */

// Import the SDK using relative paths (for local development)
import { BaasClient } from "../../src/baas/client";
import * as MpcTools from "../../src/mpc/tools";
import * as BaasTypes from "../../src/generated/baas/models";
import { ToolDefinition } from "../../src/mpc/types";

${code.replace(/MpcTools\./g, "MpcTools.").replace(/BaasClient/g, "BaasClient")}
`;

    fs.writeFileSync(filePath, fileContent);
    console.log(`Tool definition written to ${filePath}`);
  }

  // Generate index.ts to export all tools
  const indexCode = `
/**
 * Auto-generated MPC tools for the BaaS SDK
 * DO NOT EDIT DIRECTLY - Regenerate using the tools generator
 */

// Import types using relative paths (for local development)
import { ToolDefinition } from "../../src/mpc/types";
${Object.keys(toolDefinitions)
  .map((method) => {
    const toolName =
      method
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "") + "_tool";
    const fileName = method
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
    return `import { ${toolName} } from './${fileName}';`;
  })
  .join("\n")}

// Export all tools
${Object.keys(toolDefinitions)
  .map((method) => {
    const snakeCaseName = method
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "");
    return `export * from './${snakeCaseName}';`;
  })
  .join("\n")}

// Export all tools in an array for easy registration
export const allTools: ToolDefinition[] = [
  ${Object.keys(toolDefinitions)
    .map((method) => {
      const toolName =
        method
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "") + "_tool";
      return toolName;
    })
    .join(",\n  ")}
];

// Export convenient method to register all tools with an MPC server
export async function registerAllTools(
  registerFn: (tool: ToolDefinition) => Promise<void> | void,
  apiKey?: string
): Promise<void> {
  for (const tool of allTools) {
    try {
      await registerFn(tool);
    } catch (error) {
      console.error(\`Failed to register tool \${tool.name}:\`, error);
    }
  }
}

// Export helper to get a specific tool by name
export function getToolByName(name: string): ToolDefinition | undefined {
  return allTools.find(tool => tool.name === name);
}

// Export a type map of all tool parameters for TypeScript users
export type ToolParameters = {
  ${Object.keys(toolDefinitions)
    .map((method) => {
      const snakeCaseName = method
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      return `'${snakeCaseName}': Parameters<typeof ${snakeCaseName}_tool.handler>[0];`;
    })
    .join("\n  ")}
};
`;

  fs.writeFileSync(path.join(config.outputDir, "index.ts"), indexCode);
  console.log(
    `Index file written to ${path.join(config.outputDir, "index.ts")}`
  );
}

// Main function
async function main() {
  try {
    console.log("Starting MPC tools generator...");

    // Get all API instances
    const config = new Configuration({ apiKey: "dummy-key" });
    const defaultApi = new DefaultApi(config);
    const calendarsApi = new CalendarsApi(config);
    const webhooksApi = new WebhooksApi(config);

    // Get methods from each API
    const botsMethods = getClassMethods(defaultApi).filter(
      (method) => !method.startsWith("_")
    );
    const calendarsMethods = getClassMethods(calendarsApi).filter(
      (method) => !method.startsWith("_")
    );
    const webhooksMethods = getClassMethods(webhooksApi).filter(
      (method) => !method.startsWith("_")
    );

    // Combine all methods
    const allMethods = [
      ...botsMethods.map((m) => `DefaultApi.${m}`),
      ...calendarsMethods.map((m) => `CalendarsApi.${m}`),
      ...webhooksMethods.map((m) => `WebhooksApi.${m}`),
    ];

    console.log(
      `This will generate MPC tools for ${allMethods.length} Meeting BaaS API methods:`
    );
    console.log("Methods to be converted:");
    allMethods.forEach((method, index) => {
      console.log(`${index + 1}. ${method}`);
    });
    console.log(); // Empty line for readability

    // Check if API key is available, but continue with stub generation if not
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      console.warn(
        "No Anthropic API key found in environment variables or .env file."
      );
      console.warn("Will generate stub tool implementations instead.");
      console.warn(
        "To generate full tools, set the ANTHROPIC_API_KEY environment variable."
      );
    }

    console.log("Generating tool definitions...");
    const toolDefinitions = await generateAllToolDefinitions();

    console.log("Writing tool definitions to files...");
    await writeToolDefinitions(toolDefinitions);

    console.log("Tool generation complete!");
    console.log(`Generated ${Object.keys(toolDefinitions).length} MPC tools`);
  } catch (error) {
    console.error("Error generating tools:", error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  main();
}

export { generateAllToolDefinitions, writeToolDefinitions };
