# Meeting BaaS SDK

<p align="center">
  <img src="https://meetingbaas.com/static/a3e9f3dbde935920a3558317a514ff1a/b5380/preview.png" alt="Meeting BaaS" width="720">
</p>

Official SDK for interacting with the [Meeting BaaS](https://meetingbaas.com) API - The unified API for Google Meet, Zoom, and Microsoft Teams.

> **Note**: This package is automatically generated from the Meeting BaaS OpenAPI specification. For development and contribution guidelines, see [DEVELOPMENT.md](https://github.com/meeting-baas/sdk-generator/blob/HEAD/DEVELOPMENT.md). For the official API reference, visit [docs.meetingbaas.com](https://docs.meetingbaas.com).

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

// Or import all tools at once
import { allTools, registerTools } from "@meeting-baas/sdk/tools";
await registerTools(allTools, register_tool);
```

### MPC Server Bundle Mode

For MPC server deployments, use the combined package mode:

```typescript
import { BaasClient, registerTools, SDK_MODE } from "@meeting-baas/sdk/tools";
import { allTools } from "@meeting-baas/sdk/tools";

// Verify we're using the MPC tools package
console.log(`SDK Mode: ${SDK_MODE}`); // Outputs: SDK Mode: MPC_TOOLS

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

The SDK includes pre-generated MPC tools for all API endpoints that can be directly imported and used in your MPC server implementation.

### Using MPC Tools

The Meeting BaaS SDK provides MPC tools with zero configuration. You can import and use them directly:

```typescript
// Import specific tools
import {
  join_meeting_tool,
  leave_meeting_tool,
  get_meeting_data_tool,
} from "@meeting-baas/sdk/tools";

// Import all tools
import { allTools } from "@meeting-baas/sdk/tools";

// Register with your MPC server
import { register_tool } from "your-mpc-server";

// Register individual tools
register_tool(join_meeting_tool);
register_tool(get_meeting_data_tool);

// Or register all tools at once
import { registerTools } from "@meeting-baas/sdk/tools";
await registerTools(allTools, register_tool);
```

### MPC Server Bundle Mode

For MPC server deployments, use the combined package mode:

```typescript
import { BaasClient, registerTools, SDK_MODE } from "@meeting-baas/sdk/tools";
import { allTools } from "@meeting-baas/sdk/tools";

// Verify we're using the MPC tools package
console.log(`SDK Mode: ${SDK_MODE}`); // Outputs: SDK Mode: MPC_TOOLS

// Create a BaaS client
const client = new BaasClient({
  apiKey: "your-api-key",
});

// Register all tools with your MPC server
import { register_tool } from "your-mpc-server";
await registerTools(allTools, register_tool);
```

## Generated MPC Tools List

All SDK methods are automatically converted to snake_case MPC tools. Here's the complete list:

### Bots API Tools

- `join_meeting`
- `leave_meeting`
- `get_meeting_data`
- `delete_data`
- `bots_with_metadata`
- `list_recent_bots`
- `retranscribe_bot`

### Calendars API Tools

- `create_calendar`
- `delete_calendar`
- `get_calendar`
- `get_event`
- `list_calendars`
- `list_events`
- `list_raw_calendars`
- `patch_bot`
- `resync_all_calendars`
- `schedule_record_event`
- `unschedule_record_event`
- `update_calendar`

### Webhooks API Tools

- `bot_webhook_documentation`
- `calendar_webhook_documentation`
- `webhook_documentation`

Each tool accepts parameters matching the SDK method's signature, converted to snake_case. For example:

```typescript
join_meeting({
  bot_name: "Meeting Assistant",
  meeting_url: "https://meet.google.com/abc-def-ghi",
  reserved: true,
});
```

## Available Methods

The SDK provides a simple interface for interacting with Meeting BaaS. Initialize the client with your API key:

```typescript
import { BaasClient } from "@meeting-baas/sdk";

const client = new BaasClient({
  apiKey: "your-api-key",
});
```

### Bots API

#### `botsWithMetadata(botName?: string?, createdAfter?: string?, createdBefore?: string?, cursor?: string?, filterByExtra?: string?, limit?: number, meetingUrl?: string?, sortByExtra?: string?, speakerName?: string?)`

*Some*BotsApi

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.botsWithMetadata(
  "example",
  "example",
  "example",
  "example",
  "example",
  123,
  "example",
  "example",
  "example"
);
```

</details>

#### `botsWithMetadata(botName?: string?, createdAfter?: string?, createdBefore?: string?, cursor?: string?, filterByExtra?: string?, limit?: number, meetingUrl?: string?, sortByExtra?: string?, speakerName?: string?)`

BotsApi

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<ListRecentBotsResponse>
await client.bots.botsWithMetadata(
  "example",
  "example",
  "example",
  "example",
  "example",
  123,
  "example",
  "example",
  "example"
);
```

</details>

#### `deleteData(uuid: string)`

Deletes a bot\'s data including recording, transcription, and logs

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.deleteData("example");
```

</details>

#### `deleteData(uuid: string)`

Deletes a bot\'s data including recording, transcription, and logs

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<DeleteResponse>
await client.bots.deleteData("example");
```

</details>

#### `getMeetingData(botId: string)`

Get meeting recording and metadata Get Meeting Data botId [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.getMeetingData("example");
```

</details>

#### `getMeetingData(botId: string)`

Get meeting recording and metadata Get Meeting Data botId [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<Metadata>
await client.bots.getMeetingData("example");
```

</details>

#### `join(joinRequest: JoinRequest)`

Have a bot join a meeting, now or in the future

<details>
<summary>Example</summary>

```typescript
import { JoinRequest } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.join({
  // ... JoinRequest properties
});
```

</details>

#### `join(joinRequest: JoinRequest)`

Have a bot join a meeting, now or in the future

<details>
<summary>Example</summary>

```typescript
import { JoinRequest } from "@meeting-baas/sdk";

// Returns: Promise<JoinResponse>
await client.bots.join({
  // ... JoinRequest properties
});
```

</details>

#### `leave(uuid: string)`

Leave Leave uuid The UUID identifier [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.leave("example");
```

</details>

#### `leave(uuid: string)`

Leave Leave uuid The UUID identifier [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<LeaveResponse>
await client.bots.leave("example");
```

</details>

#### `listRecentBots(botName?: string?, createdAfter?: string?, createdBefore?: string?, cursor?: string?, filterByExtra?: string?, limit?: number, meetingUrl?: string?, sortByExtra?: string?, speakerName?: string?)`

Retrieves a paginated list of the user\'s bots with metadata, sorted by creation date (newest first) by default

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.listRecentBots(
  "example",
  "example",
  "example",
  "example",
  "example",
  123,
  "example",
  "example",
  "example"
);
```

</details>

#### `listRecentBots(botName?: string?, createdAfter?: string?, createdBefore?: string?, cursor?: string?, filterByExtra?: string?, limit?: number, meetingUrl?: string?, sortByExtra?: string?, speakerName?: string?)`

Retrieves a paginated list of the user\'s bots with metadata, sorted by creation date (newest first) by default

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<ListRecentBotsResponse>
await client.bots.listRecentBots(
  "example",
  "example",
  "example",
  "example",
  "example",
  123,
  "example",
  "example",
  "example"
);
```

</details>

#### `retranscribeBot(retranscribeBody: RetranscribeBody)`

Transcribe or retranscribe a bot\'s audio using the Default or your provided Speech to Text Provider Retranscribe Bot retranscribeBody [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
import { RetranscribeBody } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.bots.retranscribeBot({
  // ... RetranscribeBody properties
});
```

</details>

#### `retranscribeBot(retranscribeBody: RetranscribeBody)`

Transcribe or retranscribe a bot\'s audio using the Default or your provided Speech to Text Provider Retranscribe Bot retranscribeBody [options] Override http request option.

<details>
<summary>Example</summary>

```typescript
import { RetranscribeBody } from "@meeting-baas/sdk";

// Returns: Promise<void>
await client.bots.retranscribeBot({
  // ... RetranscribeBody properties
});
```

</details>

### Calendars API

#### `createCalendar(createCalendarParams: CreateCalendarParams)`

*Some*CalendarsApi

<details>
<summary>Example</summary>

```typescript
import { CreateCalendarParams } from "@meeting-baas/sdk";

// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.createCalendar({
  // ... CreateCalendarParams properties
});
```

</details>

#### `createCalendar(createCalendarParams: CreateCalendarParams)`

CalendarsApi

<details>
<summary>Example</summary>

```typescript
import { CreateCalendarParams } from "@meeting-baas/sdk";

// Returns: Promise<CreateCalendarResponse>
await client.calendars.createCalendar({
  // ... CreateCalendarParams properties
});
```

</details>

#### `deleteCalendar(uuid: string)`

Permanently removes a calendar integration by its UUID, including all associated events and bot configurations

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.deleteCalendar("example");
```

</details>

#### `deleteCalendar(uuid: string)`

Permanently removes a calendar integration by its UUID, including all associated events and bot configurations

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<void>
await client.calendars.deleteCalendar("example");
```

</details>

#### `getCalendar(uuid: string)`

Retrieves detailed information about a specific calendar integration by its UUID

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.getCalendar("example");
```

</details>

#### `getCalendar(uuid: string)`

Retrieves detailed information about a specific calendar integration by its UUID

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<Calendar>
await client.calendars.getCalendar("example");
```

</details>

#### `getEvent(uuid: string)`

Retrieves comprehensive details about a specific calendar event by its UUID

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.getEvent("example");
```

</details>

#### `getEvent(uuid: string)`

Retrieves comprehensive details about a specific calendar event by its UUID

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<Event>
await client.calendars.getEvent("example");
```

</details>

#### `listCalendars()`

Retrieves all calendars that have been integrated with the system for the authenticated user

#### `listCalendars()`

Retrieves all calendars that have been integrated with the system for the authenticated user

#### `listEvents(calendarId: string, attendeeEmail?: string?, cursor?: string?, organizerEmail?: string?, startDateGte?: string?, startDateLte?: string?, status?: string?, updatedAtGte?: string?)`

Retrieves a paginated list of calendar events with comprehensive filtering options

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<(axios?: AxiosInstance, basePath?: string) =>
await client.calendars.listEvents(
  "example",
  "example",
  "example",
  "example",
  "example",
  "example",
  "example",
  "example"
);
```

</details>

#### `listEvents(calendarId: string, attendeeEmail?: string?, cursor?: string?, organizerEmail?: string?, startDateGte?: string?, startDateLte?: string?, status?: string?, updatedAtGte?: string?)`

Retrieves a paginated list of calendar events with comprehensive filtering options

<details>
<summary>Example</summary>

```typescript
// Returns: Promise<ListEventResponse>
await client.calendars.listEvents(
  "example",
  "example",
  "example",
  "example",
  "example",
  "example",
  "example",
  "example"
);
```

</details>

#### `listRawCalendars(listRawCalendarsParams: ListRawCalendarsParams)`

Retrieves unprocessed calendar data directly from the provider (Google, Microsoft) using provided OAuth credentials

<details>
<summary>Example</summary>

```

```
