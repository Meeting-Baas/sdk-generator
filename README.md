# Meeting BaaS SDK

<p align="center">
  <img src="https://meetingbaas.com/static/a3e9f3dbde935920a3558317a514ff1a/b5380/preview.png" alt="Meeting BaaS" width="720">
</p>

Official SDK for interacting with the [Meeting BaaS](https://meetingbaas.com) API - The unified API for Google Meet, Zoom, and Microsoft Teams.

> **Note**: This package is automatically generated from the Meeting BaaS OpenAPI specification. For development and contribution guidelines, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## Features

- **BaaS API Client**: Strongly typed functions for interacting with the Meeting BaaS API
- **Bot Management**: Create, join, and manage meeting bots across platforms
- **Calendar Integration**: Connect calendars and automatically schedule meeting recordings
- **Complete API Coverage**: Access to all Meeting BaaS API endpoints
- **TypeScript Support**: Full TypeScript definitions for all APIs
- **MPC Tool Registration**: Simple way to register client tools with an MPC server
- **CLI Interface**: Command-line tools for common operations
- **Automatic MPC Tool Generation**: Pre-generated MPC tools for all SDK methods
- **Combined Package Mode**: Special bundle for MPC server installations

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

### Using MPC Tools

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

For MPC server deployments, use the combined package mode:

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

## Available MPC Tools

The SDK includes pre-generated MPC tools for all API endpoints:

- **Meeting Management**: Join meetings, leave meetings, get meeting data
- **Transcript Tools**: Get formatted transcripts, search within transcripts, find key moments
- **Calendar Integration**: List calendars, integrate with OAuth, schedule recordings
- **Data Management**: Delete meeting data, list bots with metadata

## About Meeting BaaS

[Meeting BaaS](https://meetingbaas.com) provides a unified API for integrating with various meeting platforms (Google Meet, Zoom, and Microsoft Teams). We offer features like:

- Raw Video: Instant availability of video recordings from meetings in S3 buckets
- Transcription and LLM Summaries: Integration with Gladia and other providers
- Metadata: Participant names and speech timestamps
- Multiplatform Support: Record Zoom, Meet, and Teams with simple HTTP requests
- Calendar sync: Easily connect your end user's agenda

## License

[MIT](LICENSE)
