# Meeting BaaS SDK Usage Guide

This guide explains how to use the generated TypeScript SDK for the Meeting BaaS API.

## Installation

The SDK is generated using OpenAPI Generator with the typescript-axios generator. After generating the SDK, you can use it in your TypeScript/JavaScript project.

```bash
# Install required dependencies
npm install axios
```

## SDK Setup

Import and initialize the SDK with your API key:

```typescript
import { Configuration, DefaultApi, CalendarsApi } from "./src/generated/baas";

// Initialize the configuration with your API key
const config = new Configuration({
  apiKey: "YOUR_API_KEY",
  basePath: "https://api.meetingbaas.com",
});

// Create API instances
const defaultApi = new DefaultApi(config);
const calendarsApi = new CalendarsApi(config);
```

## Available APIs

The SDK includes two main API classes:

1. `DefaultApi` - For bot-related operations
2. `CalendarsApi` - For calendar-related operations

### DefaultApi Methods

The `DefaultApi` provides the following methods:

- `join(joinRequest)` - Have a bot join a meeting
- `leave()` - Leave the meeting
- `getMeetingData(botId)` - Get meeting recording and metadata
- `deleteData()` - Delete a bot's data
- `botsWithMetadata(...)` - List bots with metadata
- `retranscribeBot(retranscribeBody)` - Retranscribe a bot's audio

### CalendarsApi Methods

The `CalendarsApi` provides the following methods:

- `listRawCalendars(params)` - List available calendars from provider
- `listCalendars()` - List integrated calendars
- `createCalendar(params)` - Integrate a new calendar
- `getCalendar()` - Get calendar details
- `updateCalendar(params)` - Update calendar integration
- `deleteCalendar()` - Delete calendar integration
- `resyncAllCalendars()` - Resync all calendars
- `listEvents(calendarId, ...)` - List calendar events
- `getEvent()` - Get event details
- `scheduleRecordEvent(botParam2, allOccurrences)` - Schedule recording for an event
- `unscheduleRecordEvent(allOccurrences)` - Cancel scheduled recording
- `patchBot(botParam3, allOccurrences)` - Update bot configuration

## Usage Examples

### Joining a Meeting

```typescript
import { JoinRequest } from "./src/generated/baas";

const joinMeeting = async () => {
  const request: JoinRequest = {
    bot_name: "Recording Bot",
    meeting_url: "https://meet.google.com/abc-defg-hij",
    reserved: true,
    webhook_url: "https://your-webhook.com/endpoint",
  };

  try {
    const response = await defaultApi.join(request);
    console.log("Bot joined meeting successfully:", response.data.bot_id);
    return response.data.bot_id;
  } catch (error) {
    console.error("Failed to join meeting:", error);
  }
};
```

### Getting Meeting Data

```typescript
const getMeetingData = async (botId: string) => {
  try {
    const response = await defaultApi.getMeetingData(botId);
    console.log("Meeting data:", response.data);

    // Access recording URL
    const mp4Url = response.data.mp4;

    // Access transcripts
    const transcripts = response.data.bot_data.transcripts;

    return response.data;
  } catch (error) {
    console.error("Failed to get meeting data:", error);
  }
};
```

### Working with Calendars

```typescript
import { CreateCalendarParams, Provider } from "./src/generated/baas";

const createCalendar = async () => {
  const params: CreateCalendarParams = {
    oauth_client_id: "your-oauth-client-id",
    oauth_client_secret: "your-oauth-client-secret",
    oauth_refresh_token: "your-oauth-refresh-token",
    platform: Provider.Google,
  };

  try {
    const response = await calendarsApi.createCalendar(params);
    console.log("Calendar created:", response.data.calendar);
    return response.data.calendar.uuid;
  } catch (error) {
    console.error("Failed to create calendar:", error);
  }
};

const listCalendarEvents = async (calendarId: string) => {
  try {
    const response = await calendarsApi.listEvents(calendarId);
    console.log("Calendar events:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to list calendar events:", error);
  }
};
```

### Scheduling a Recording for a Calendar Event

```typescript
import { BotParam2 } from "./src/generated/baas";

const scheduleRecording = async (eventUuid: string) => {
  // Configure the bot parameters
  const botParams: BotParam2 = {
    bot_name: "Calendar Recording Bot",
    extra: {},
    webhook_url: "https://your-webhook.com/endpoint",
  };

  try {
    // Schedule recording for all occurrences of a recurring event
    const response = await calendarsApi.scheduleRecordEvent(botParams, true);
    console.log("Recording scheduled for events:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to schedule recording:", error);
  }
};
```

## Error Handling

The SDK uses Axios for HTTP requests, so you can handle errors using try/catch blocks:

```typescript
try {
  const response = await defaultApi.join(joinRequest);
  // Handle success
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Error status:", error.response.status);
    console.error("Error data:", error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error.message);
  }
}
```

## Notes

- The SDK is generated from the OpenAPI specification from `api.gmeetbot.com`
- The API requires an API key for authentication, which should be included in the Configuration object
- Some endpoints may have warnings about path parameters not being defined in the API specification
