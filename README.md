# Meeting Tools SDK

A TypeScript SDK for interacting with the BaaS (Bot as a Service) API and registering tools with the MPC (Meeting Processing Client).

## Features

- **BaaS API Client**: Strongly typed functions for interacting with the Meeting BaaS API
- **MPC Tool Registration**: Simple way to register client tools with an MPC server
- **CLI Interface**: Command-line tools for common operations
- **TypeScript Support**: Full TypeScript definitions for all APIs
- **Automatic MPC Tool Generation**: Generate MPC tools from SDK methods

## Installation

```bash
pnpm add @meeting-tools/sdk
```

## Usage

### Basic Usage

```typescript
import { BaasClient, MpcTools } from "@meeting-tools/sdk";

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key",
});

// Join a meeting
const botId = await client.joinMeeting({
  botName: "My Assistant",
  meetingUrl: "https://meet.google.com/abc-def-ghi",
  reserved: true,
});

// Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log("Meeting data:", meetingData);
```

### Using Generated MPC Tools

```typescript
import { register_tool } from "your-mpc-server";
import {
  join_meeting_tool,
  get_meeting_data_tool,
  delete_data_tool,
} from "@meeting-tools/sdk/dist/generated-tools";

// Register tools with your MPC server
register_tool(join_meeting_tool);
register_tool(get_meeting_data_tool);
register_tool(delete_data_tool);
```

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository
2. Install dependencies

```bash
pnpm install
```

### Development Workflow

The SDK is built in three main steps:

1. **OpenAPI Client Generation**: Generates TypeScript code from the BaaS OpenAPI specification
2. **SDK Build**: Compiles the SDK code, including the OpenAPI-generated client
3. **MPC Tools Generation**: Generates MPC tool definitions that wrap the SDK methods

### Build Commands

```bash
# Step 1: Generate the OpenAPI client
pnpm openapi:generate

# Step 2: Build the SDK
pnpm build

# Step 3: Generate MPC tool definitions
pnpm tools:generate

# Alternatively, run all steps in sequence
pnpm tools:rebuild
```

### Environment Variables

For MPC tools generation, create a `.env` file with:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
DEBUG=true
```

## License

MIT
