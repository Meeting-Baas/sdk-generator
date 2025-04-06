/**
 * Example MPC Server Implementation with Meeting BaaS SDK
 *
 * This file demonstrates how to integrate Meeting BaaS SDK tools with an MPC server.
 */

// Import Meeting BaaS tools and client
import { BaasClient } from "@meeting-baas/sdk";
import { allTools, registerTools } from "@meeting-baas/sdk/tools";

// Setup your MPC server (example using a basic server interface)
interface McpServer {
  registerTool: (tool: any) => Promise<void>;
  start: () => Promise<void>;
}

/**
 * Initialize and configure your MPC server
 *
 * @param apiKey Your Meeting BaaS API key
 * @returns Configured MPC server
 */
async function setupMcpServer(apiKey: string): Promise<McpServer> {
  // Create a simple MPC server (replace with your actual implementation)
  const server: McpServer = {
    registerTool: async (tool) => {
      console.log(`Registered tool: ${tool.name}`);
      // Your actual tool registration would happen here
    },
    start: async () => {
      console.log("MPC server started");
      // Your actual server startup would happen here
    },
  };

  // Method 1: Register all tools and create a client manually
  const client = new BaasClient({ apiKey });
  await registerTools(allTools, server.registerTool);

  // Alternatively, Method 2: Use the convenience method
  // const client = setupBaasTools(allTools, server.registerTool, apiKey);

  return server;
}

/**
 * Example API route handler in Next.js
 */
export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    // Create and configure the MPC server
    const server = await setupMcpServer(apiKey);

    // Start the server
    await server.start();

    // Handle the request (simplified)
    const response = {
      content: "Response from MPC server with Meeting BaaS tools",
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// For standalone script usage
if (require.main === module) {
  // Get API key from environment or command line
  const apiKey = process.env.MEETING_BAAS_API_KEY || process.argv[2];

  if (!apiKey) {
    console.error(
      "API key required! Set MEETING_BAAS_API_KEY or pass as argument"
    );
    process.exit(1);
  }

  setupMcpServer(apiKey)
    .then((server) => server.start())
    .then(() => console.log("Server ready"))
    .catch((error) => console.error("Failed to start server:", error));
}
