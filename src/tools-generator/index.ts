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
import { BaasClient } from "../baas/client";
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
  model: process.env.MODEL || "claude-3-opus-20240229",
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

  // If no API key available, generate a stub tool instead
  if (!config.anthropicApiKey) {
    console.warn("No Anthropic API key found. Generating a stub tool instead.");
    return generateSimpleStubToolDefinition(methodName);
  }

  const prompt = `
You are a TypeScript expert who converts SDK methods into MPC tool definitions.

Given the following SDK method:

METHOD NAME: ${methodName}
METHOD INFO:
${methodInfo}

And these example MPC tools:
${exampleTools}

Create an MPC tool definition that wraps this SDK method. The tool should:
1. Have a descriptive name based on the method name (converting camelCase to snake_case)
2. Include a clear description of what the tool does
3. Define all necessary parameters with proper types, descriptions, and required flags
4. Include proper error handling and meaningful response formatting
5. Use the BaasClient instance that will be provided to execute the method

Respond ONLY with valid TypeScript code for the tool definition, with no explanation or additional text.
The code should use the MpcTools helper functions like createTool, createStringParameter, etc.
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

// Generate all tool definitions
async function generateAllToolDefinitions(): Promise<Record<string, string>> {
  const baasClientInstance = new BaasClient({ apiKey: "dummy-key" });
  const baasMethods = getClassMethods(baasClientInstance);

  // Get example tools for reference
  const exampleTools = fs.readFileSync(
    path.resolve(__dirname, "./example-tool-templates.ts"),
    "utf-8"
  );

  const toolDefinitions: Record<string, string> = {};

  for (const method of baasMethods) {
    if (method.startsWith("_")) continue; // Skip private methods

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

// Import the SDK using the package entry point
import { BaasClient, MpcTools, BaasTypes } from "@meeting-tools/sdk";
import { ToolDefinition } from "@meeting-tools/sdk/dist/mpc/types";

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

import { ToolDefinition } from "@meeting-tools/sdk/dist/mpc/types";
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

    // Check if API key is available, but continue with stub generation if not
    if (!config.anthropicApiKey) {
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
