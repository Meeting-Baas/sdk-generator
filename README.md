# Meeting BaaS SDK

<p align="center">
  <img src="https://meetingbaas.com/static/a7d46fd33668f28baa9cbf66005489f0/a6312/preview.png" alt="Meeting BaaS" width="120">
</p>

Official SDK for interacting with the [Meeting BaaS](https://meetingbaas.com) API - The unified API for Google Meet, Zoom, and Microsoft Teams.

## Features

- **BaaS API Client**: Strongly typed functions for interacting with the Meeting BaaS API
- **Bot Management**: Create, join, and manage meeting bots across platforms
- **Calendar Integration**: Connect calendars and automatically schedule meeting recordings
- **Complete API Coverage**: Access to all 13 endpoints of the Meeting BaaS API
- **TypeScript Support**: Full TypeScript definitions for all APIs
- **MPC Tool Registration**: Simple way to register client tools with an MPC server
- **CLI Interface**: Command-line tools for common operations
- **Automatic MPC Tool Generation**: Generate MPC tools from SDK methods
- **Combined Package Mode**: Special bundle for MPC server installations with pre-generated tools

## Installation

```bash
# With npm
npm install @meeting-baas/sdk

# With yarn
yarn add @meeting-baas/sdk

# With pnpm
pnpm add @meeting-baas/sdk
```

## Quick Start

```typescript
import { BaasClient } from "@meeting-baas/sdk";

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key", // Get yours at https://meetingbaas.com
});

// Join a meeting
const botId = await client.joinMeeting({
  botName: "Meeting Assistant",
  meetingUrl: "https://meet.google.com/abc-def-ghi",
  reserved: true,
});

// Get meeting data
const meetingData = await client.getMeetingData(botId);
console.log("Meeting data:", meetingData);
```

## Usage Examples

### Basic Usage

```typescript
import { BaasClient } from "@meeting-baas/sdk";

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

// Delete meeting data
await client.deleteData(botId);
```

### Using Generated MPC Tools

```typescript
import { register_tool } from "your-mpc-server";
import {
  join_meeting_tool,
  get_meeting_data_tool,
  delete_data_tool,
} from "@meeting-baas/sdk/tools";

// Register tools with your MPC server
register_tool(join_meeting_tool);
register_tool(get_meeting_data_tool);
register_tool(delete_data_tool);
```

### MPC Server Bundle Mode

For MPC server deployments, you can use the combined package mode, which includes both the SDK and MPC tools:

```typescript
import { BaasClient, registerTools, SDK_MODE } from "@meeting-baas/sdk/bundle";
import { allTools } from "@meeting-baas/sdk/tools";

// Verify we're using the MPC server bundle
console.log(`SDK Mode: ${SDK_MODE}`); // Outputs: SDK Mode: MPC_SERVER

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key",
});

// Register all tools with your MPC server
import { register_tool } from "your-mpc-server";
await registerTools(allTools, register_tool);

// Or register individual tools
import { join_meeting_tool } from "@meeting-baas/sdk/tools";
register_tool(join_meeting_tool);
```

### Calendar Integration

```typescript
import { BaasClient, Provider } from "@meeting-baas/sdk";

const client = new BaasClient({
  apiKey: "your-api-key",
});

// Create a calendar integration
const calendar = await client.createCalendar({
  oauthClientId: "your-oauth-client-id",
  oauthClientSecret: "your-oauth-client-secret",
  oauthRefreshToken: "your-oauth-refresh-token",
  platform: Provider.Google,
});

// List all calendars
const calendars = await client.listCalendars();

// List events from a calendar
const events = await client.listEvents(calendar.uuid);

// Schedule a recording for an event
await client.scheduleRecordEvent(events[0].uuid, {
  botName: "Event Recording Bot",
  extra: { customId: "my-event-123" },
});
```

## SDK API Coverage

The SDK provides access to all 13 endpoints of the Meeting BaaS API, including:

### Bot Management

- Join meetings with customizable bot parameters
- Leave meetings and clean up resources
- Get recording data and transcripts
- Delete meeting data for privacy compliance
- List bots with metadata and filtering options
- Retranscribe audio with different providers

### Calendar Integration

- List and integrate calendars from Google and Microsoft
- Create, update, and delete calendar connections
- List and filter calendar events
- Get detailed event information
- Schedule recordings for specific events or recurring series
- Update bot configurations for scheduled recordings

## MPC Tools Generation

The SDK includes an automatic MPC tool generation system that creates Claude Plugin (MPC) tools from SDK methods. Here's how it works:

### How MPC Tools Are Generated

1. **Template-Based Generation**: The SDK uses example templates in `src/tools-generator/example-tool-templates.ts` to inform the tool generation process.

2. **AI-Powered Generation**: When you run `pnpm tools:generate`, the system:

   - Analyzes all methods in the BaasClient SDK
   - Calls the Anthropic API with method signatures and example templates
   - Generates properly formatted MPC tool definitions for each SDK method
   - Writes these generated tools to the output directory (`dist/generated-tools`)

3. **Generated Tool Structure**: Each generated tool includes:
   - Properly defined parameters (with types, descriptions, and required flags)
   - Parameter conversion between snake_case (tool) and camelCase (SDK)
   - User-friendly formatting for complex responses
   - Comprehensive error handling

### Using Generated MPC Tools

The generated tools are included in the SDK distribution and can be used in several ways:

#### Importing Individual Tools

```typescript
import {
  join_meeting_tool,
  get_meeting_transcript_tool,
  search_meeting_transcript_tool,
  find_key_moments_tool,
  list_upcoming_meetings_tool,
} from "@meeting-baas/sdk/tools";

// Register with your MPC server
import { register_tool } from "your-mpc-server";
register_tool(join_meeting_tool);
register_tool(search_meeting_transcript_tool);
```

#### Importing All Tools

```typescript
import { allTools } from "@meeting-baas/sdk/tools";
import { register_tool } from "your-mpc-server";

// Register all tools
for (const tool of allTools) {
  register_tool(tool);
}
```

#### Bundle Mode for MPC Servers

```typescript
import { registerTools } from "@meeting-baas/sdk/bundle";
import { allTools } from "@meeting-baas/sdk/tools";
import { register_tool } from "your-mpc-server";

// Register all tools at once
await registerTools(allTools, register_tool);
```

### Available MPC Tools

The SDK generates tools for all API endpoints, including:

- **Meeting Management**: Join meetings, leave meetings, get meeting data
- **Transcript Tools**: Get formatted transcripts, search within transcripts, find key moments
- **Calendar Integration**: List calendars, integrate with OAuth, schedule recordings
- **Data Management**: Delete meeting data, list bots with metadata

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository

```bash
git clone https://github.com/meeting-baas/sdk-generator.git
cd sdk-generator
```

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
# Step 1: Fetch the OpenAPI spec and generate the client
./scripts/openapi-fetch-generate.sh --generate

# Step 2: Build the SDK
pnpm build

# Step 3: Generate MPC tool definitions
pnpm tools:generate

# Alternatively, run all steps in sequence
pnpm tools:rebuild
```

### Customizing MPC Tool Generation

To customize how MPC tools are generated:

1. Edit the example templates in `src/tools-generator/example-tool-templates.ts`
2. Add new examples for specific types of tools (e.g., transcript search, calendar integration)
3. Run the generation process again with `pnpm tools:generate`

### Environment Variables

For MPC tools generation, create a `.env` file with:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
DEBUG=true
```

## Contributing

We welcome contributions to the Meeting BaaS SDK! Please feel free to submit issues or pull requests.

## About Meeting BaaS

[Meeting BaaS](https://meetingbaas.com) provides a unified API for integrating with various meeting platforms (Google Meet, Zoom, and Microsoft Teams). We offer features like:

- Raw Video: Instant availability of video recordings from meetings in S3 buckets
- Transcription and LLM Summaries: Integration with Gladia and other providers
- Metadata: Participant names and speech timestamps
- Multiplatform Support: Record Zoom, Meet, and Teams with simple HTTP requests
- Calendar sync: Easily connect your end user's agenda

## License

[MIT](LICENSE)
