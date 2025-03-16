# Meeting BaaS API Documentation
Retrieved on Sat 15 Mar 2025 10:59:56 CET



## Sending a Bot

Sending a bot | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/sending-a-bot/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started

# Sending a bot

Learn how to send AI bots to meetings through the Meeting BaaS API, with options for immediate or scheduled joining and customizable settings

# [Sending a Bot to a Meeting](#sending-a-bot-to-a-meeting)

You can summon a bot in two ways:

1.  **Immediately to a meeting**, provided your bot pool is sufficient.
2.  **Reserved join in 4 minutes**, ideal for scheduled meetings.

## [API Request](#api-request)

Send a POST request to [https://api.meetingbaas.com/bots](https://api.meetingbaas.com/bots):

BashPythonJavaScript

join\_meeting.sh

```
curl -X POST "https://api.meetingbaas.com/bots" \
     -H "Content-Type: application/json" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY" \
     -d '{
           "meeting_url": "YOUR-MEETING-URL",
           "bot_name": "AI Notetaker",
           "recording_mode": "speaker_view",
           "bot_image": "https://example.com/bot.jpg",
           "entry_message": "I am a good meeting bot :)",
           "reserved": false,
           "speech_to_text": {
             "provider": "Default"
           },
           "automatic_leave": {
             "waiting_room_timeout": 600
           }
         }'
```

## [Request Parameters](#request-parameters)

### [Required Parameters](#required-parameters)

-   `meeting_url`: The meeting URL to join. Accepts Google Meet, Microsoft Teams or Zoom URLs.
-   `bot_name`: The display name of the bot.
-   `reserved`: Controls how the bot joins the meeting
    -   `false`: Sends a bot from our pool of *always ready* meeting bots, immediately. Beware that **demand might temporarily be higher than the number of currently available bots**, which could imply a delay in the bot joining. When possible, prefer the true option which reserves an instance of an AI meeting bot.
    -   `true`: Reserves in advance a meeting bot for an upcoming meeting, ensuring the presence of the bot at the start of the meeting, typically for planned calendar events. You need to **call this route exactly 4 minutes before the start of the meeting**.

### [Recording Options](#recording-options)

-   `recording_mode`: Optional. One of:
    -   `"speaker_view"`: (default) The recording will only show the person speaking at any time
    -   `"gallery_view"`: The recording will show all the speakers
    -   `"audio_only"`: The recording will be a mp3

### [Bot Appearance and Behavior](#bot-appearance-and-behavior)

-   `bot_image`: The URL of the image the bot will display. Must be a valid URI format. Optional.
-   `entry_message`: Optional. The message the bot will write within 15 seconds after being accepted in the meeting.

### [Transcription Settings](#transcription-settings)

-   `speech_to_text`: Optional. If not provided, no transcription will be generated and processing time will be faster.
    -   Must be an object with:
        -   `provider`: One of:
            -   `"Default"`: Standard transcription, no API key needed
            -   `"Gladia"` or `"Runpod"`: Requires their respective API key to be provided
        -   `api_key`: Required when using Gladia or Runpod providers. Must be a valid API key from the respective service.

### [Automatic Leaving](#automatic-leaving)

-   `automatic_leave`: Optional object containing:
    -   `waiting_room_timeout`: Time in seconds the bot will wait in a meeting room before dropping. Default is 600 (10 minutes)
    -   `noone_joined_timeout`: Time in seconds the bot will wait if no one joins the meeting

### [Advanced Options](#advanced-options)

-   `webhook_url`: URL for webhook notifications
-   `deduplication_key`: String for deduplication. By default, Meeting BaaS will reject you sending multiple bots to a same meeting within 5 minutes, to avoid spamming.
-   `streaming`: Object containing optional WebSocket streaming configuration:
    -   `audio_frequency`: Audio frequency for the WebSocket streams. Can be "16khz" or "24khz" (defaults to "24khz")
    -   `input`: WebSocket endpoint to receive raw audio bytes and speaker diarization as JSON strings from the meeting
    -   `output`: WebSocket endpoint to stream raw audio bytes back into the meeting, enabling bot speech
-   `extra`: Additional custom data
-   `start_time`: Unix timestamp (in milliseconds) for when the bot should join the meeting. The bot joins 4 minutes before this timestamp. For example, if you want the bot to join at exactly 2:00 PM, set this to the millisecond timestamp of 2:00 PM.

## [Response](#response)

The API will respond with the unique identifier for your bot:

```
HTTP/2 200
Content-Type: application/json
 
{
  "bot_id": 42
}
```

## [Next Steps](#next-steps)

Use this `bot_id` to:

-   [Monitor the bot's status and receive meeting data](/docs/api/getting-started/getting-the-data)
-   [Remove the bot from the meeting](/docs/api/getting-started/removing-a-bot)

[

Previous

Introduction

](/docs/api)[

Next

Removing a Bot

](/docs/api/getting-started/removing-a-bot)

### On this page

[

Sending a Bot to a Meeting](#sending-a-bot-to-a-meeting)[

API Request](#api-request)[

Request Parameters](#request-parameters)[

Required Parameters](#required-parameters)[

Recording Options](#recording-options)[

Bot Appearance and Behavior](#bot-appearance-and-behavior)[

Transcription Settings](#transcription-settings)[

Automatic Leaving](#automatic-leaving)[

Advanced Options](#advanced-options)[

Response](#response)[

Next Steps](#next-steps)

Ask AI

---



## Removing a Bot

Removing a Bot | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/removing-a-bot/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started

# Removing a Bot

Learn how to remove a bot from an ongoing meeting using the API

# [Removing a Bot](#removing-a-bot)

## [Overview](#overview)

When you need to end a bot's participation in a meeting, you can use the API to remove it immediately. This is useful for:

-   Ending recordings early
-   Freeing up bot resources
-   Responding to meeting conclusion

## [API Request](#api-request)

Send a DELETE request to `https://api.meetingbaas.com/bots/{YOUR_BOT_ID}`:

BashPythonJavaScript

leave\_meeting.sh

```
curl -X DELETE "https://api.meetingbaas.com/bots/YOUR_BOT_ID" \
     -H "Content-Type: application/json" \
     -H "x-meeting-baas-api-key: YOUR-API-KEY"
```

## [Required Parameters](#required-parameters)

-   **Path Parameter**: `bot_id` - The unique identifier received when [sending the bot](/docs/api/getting-started/sending-a-bot)
-   **Header**: `x-meeting-baas-api-key` - Your API key for authentication

Both parameters are mandatory for the request to succeed.

## [Response](#response)

The API will respond with a simple confirmation:

```
HTTP/2 200
Content-Type: application/json
 
{ "ok": true }
```

## [What Happens Next](#what-happens-next)

When a bot is removed:

1.  The bot leaves the meeting immediately
2.  A `call_ended` status event is sent to your webhook
3.  The final meeting data up to that point is delivered

For more details about these webhook events, see [Getting the Data](/docs/api/getting-started/getting-the-data).

[

Previous

Sending a bot

](/docs/api/getting-started/sending-a-bot)[

Next

Getting the Data

](/docs/api/getting-started/getting-the-data)

### On this page

[

Removing a Bot](#removing-a-bot)[

Overview](#overview)[

API Request](#api-request)[

Required Parameters](#required-parameters)[

Response](#response)[

What Happens Next](#what-happens-next)

Ask AI

---



## Getting the Data

Getting the Data | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/getting-the-data/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started

# Getting the Data

Learn how to receive meeting data through webhooks

# [Getting Meeting Data](#getting-meeting-data)

Your webhook URL will receive two types of data:

1.  Live meeting events during the meeting
2.  Final meeting data after completion

These events will start flowing in after [sending a bot to a meeting](/docs/api/getting-started/sending-a-bot).

## [1\. Live Meeting Events](#1-live-meeting-events)

```
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY
 
{
  "event": "bot.status_change",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": {
      "code": "joining_call",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### [Status Event Fields](#status-event-fields)

-   `event`: The key-value pair for bot status events. Always `bot.status_change`.
-   `data.bot_id`: The identifier of the bot.
-   `data.status.code`: The code of the event. One of:
    -   `joining_call`: The bot has acknowledged the request to join the call.
    -   `in_waiting_room`: The bot is in the "waiting room" of the meeting.
    -   `in_call_not_recording`: The bot has joined the meeting, however it is not recording yet.
    -   `in_call_recording`: The bot is in the meeting and recording the audio and video.
    -   `recording_paused`: The recording has been temporarily paused.
    -   `recording_resumed`: The recording has resumed after being paused.
    -   `call_ended`: The bot has left the call.
    -   `bot_rejected`: The bot was rejected from joining the meeting.
    -   `bot_removed`: The bot was removed from the meeting.
    -   `waiting_room_timeout`: The bot timed out while waiting to be admitted.
    -   `invalid_meeting_url`: The provided meeting URL was invalid.
    -   `meeting_error`: An unexpected error occurred during the meeting.
-   `data.status.created_at`: An ISO string of the datetime of the event.

When receiving an `in_call_recording` event, additional data is provided:

-   `data.status.start_time`: The timestamp when the recording started.

For `meeting_error` events, additional error details are provided:

-   `data.status.error_message`: A description of the error that occurred.
-   `data.status.error_type`: The type of error encountered.

## [2\. Final Meeting Data](#2-final-meeting-data)

You'll receive either a `complete` or `failed` event.

### [Success Response (`complete`)](#success-response-complete)

```
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY
 
{
  "event": "complete",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "mp4": "https://bots-videos.s3.eu-west-3.amazonaws.com/path/to/video.mp4?X-Amz-Signature=...",
    "speakers": ["Alice", "Bob"],
    "transcript": [{
      "speaker": "Alice",
      "words": [{
        "start": 1.3348110430839002,
        "end": 1.4549110430839003,
        "word": "Hi"
      }, {
        "start": 1.4549110430839003,
        "end": 1.5750110430839004,
        "word": "Bob!"
      }]
    }, {
      "speaker": "Bob",
      "words": [{
        "start": 2.6583010430839,
        "end": 2.778401043083901,
        "word": "Hello"
      }, {
        "start": 2.778401043083901,
        "end": 2.9185110430839005,
        "word": "Alice!"
      }]
    }]
  }
}
```

**IMPORTANT**: The mp4 URL is a pre-signed AWS S3 URL that is only valid for 2 hours. Make sure to download the recording promptly or generate a new URL through the API if needed.

#### [Complete Response Fields](#complete-response-fields)

-   `bot_id`: The identifier of the bot.
-   `mp4`: A private AWS S3 URL of the mp4 recording of the meeting. Valid for two hours only.
-   `speakers`: The list of speakers in this meeting. Currently requires transcription to be enabled.
-   `transcript` (optional): The meeting transcript. Only given when `speech_to_text` is set when asking for a bot. An array containing:
    -   `transcript.speaker`: The speaker name.
    -   `transcript.words`: The list of words, each containing:
        -   `transcript.words.start`: The start time of the word
        -   `transcript.words.end`: The end time of the word
        -   `transcript.words.word`: The word itself

### [Failure Response (`failed`)](#failure-response-failed)

```
POST /your-endpoint
x-meeting-baas-api-key: YOUR-API-KEY
 
{
  "event": "failed",
  "data": {
    "bot_id": "123e4567-e89b-12d3-a456-426614174000",
    "error": "CannotJoinMeeting"
  }
}
```

### [Error Types](#error-types)

Error

Description

CannotJoinMeeting

The bot could not join the meeting URL provided. In most cases, this is because the meeting URL was only accessible for logged-in users invited to the meeting.

TimeoutWaitingToStart

The bot has quit after waiting to be accepted. By default this is 10 minutes, configurable via `automatic_leave.waiting_room_timeout` or `automatic_leave.noone_joined_timeout` (both default to 600 seconds).

BotNotAccepted

The bot has been refused in the meeting.

BotRemoved

The bot was removed from the meeting by a participant.

InternalError

An unexpected error occurred. Please contact us if the issue persists.

InvalidMeetingUrl

The meeting URL provided is not a valid (Zoom, Meet, Teams) URL.

### [Recording End Reasons](#recording-end-reasons)

Reason

Description

bot\_removed

Bot removed by participant

no\_attendees

No participants present

no\_speaker

Extended silence

recording\_timeout

Maximum duration reached

api\_request

Bot [removed via API](/docs/api/getting-started/removing-a-bot)

meeting\_error

An error occurred during the meeting (e.g., connection issues)

[

Previous

Removing a Bot

](/docs/api/getting-started/removing-a-bot)[

Next

Calendar Synchronization

](/docs/api/getting-started/calendars)

### On this page

[

Getting Meeting Data](#getting-meeting-data)[

1\. Live Meeting Events](#1-live-meeting-events)[

Status Event Fields](#status-event-fields)[

2\. Final Meeting Data](#2-final-meeting-data)[

Success Response (`complete`)](#success-response-complete)[

Complete Response Fields](#complete-response-fields)[

Failure Response (`failed`)](#failure-response-failed)[

Error Types](#error-types)[

Recording End Reasons](#recording-end-reasons)

Ask AI

---



## Calendars Setup

Setup | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

[

Setup](/docs/api/getting-started/calendars/setup)[

Events](/docs/api/getting-started/calendars/events)[

Webhooks](/docs/api/getting-started/calendars/webhooks)[

Maintenance](/docs/api/getting-started/calendars/maintenance)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/calendars/setup/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started/[Calendar Synchronization](/docs/api/getting-started/calendars)

# Setup

Meeting BaaS allows you to automatically sync calendars from Outlook and Google Workspace to deploy bots to scheduled meetings.

## [Prerequisites](#prerequisites)

Before starting the calendar sync integration, ensure you have:

-   An active Meeting BaaS account with API access
-   A webhook endpoint configured in your Meeting BaaS account to receive calendar event notifications
-   Developer access to Google Cloud Console and/or Microsoft Entra ID

### [Authentication: Get your OAuth credentials](#authentication-get-your-oauth-credentials)

To start syncing calendars, you'll need two sets of credentials:

1.  **Your App's Credentials (Service Level)**

-   For Outlook: Your app's Microsoft Client ID and Client Secret
-   For Google Workspace: Your app's Google Client ID and Client Secret

2.  **End User's Credentials (User Level)**

-   OAuth refresh token obtained when user grants calendar access to your app

Best Practice: Request calendar access as a separate step after initial user signup. Users are more likely to grant calendar access when it's clearly tied to a specific feature they want to use.

#### [Required OAuth Scopes](#required-oauth-scopes)

For **Google Workspace**:

-   `https://www.googleapis.com/auth/calendar.readonly` - To read calendar and event data
-   `https://www.googleapis.com/auth/calendar.events.readonly` - To access event details

For **Microsoft Outlook**:

-   `Calendars.Read` - To read calendar and event data
-   `Calendars.ReadWrite` - Required if you need to modify calendar events

### [Optional: List Raw Calendars](#optional-list-raw-calendars)

Before syncing calendars, you can use the [List Raw Calendars](/docs/api/reference/calendars/list_raw_calendars) endpoint to view all your user's available calendars. This is particularly useful when a user has multiple calendars and you need to choose which ones to sync.

#### [Request Example](#request-example)

```
curl -X GET "https://api.meetingbaas.com/calendars/raw" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "refresh_token": "USER_REFRESH_TOKEN",
    "client_id": "YOUR_GOOGLE_CLIENT_ID",
    "client_secret": "YOUR_GOOGLE_CLIENT_SECRET"
  }'
```

#### [Response Example](#response-example)

```
{
  "calendars": [
    {
      "id": "primary",
      "name": "Main Calendar",
      "description": "User's primary calendar",
      "is_primary": true
    },
    {
      "id": "team_calendar@group.calendar.google.com",
      "name": "Team Calendar",
      "description": "Shared team meetings",
      "is_primary": false
    }
  ]
}
```

Calendar IDs differ between providers. Google uses email-like IDs, while Microsoft uses GUID formats.

### [Create a Calendar Integration](#create-a-calendar-integration)

Create a new calendar integration by calling the [Create Calendar](/docs/api/reference/calendars/create_calendar) endpoint with the previously obtained credentials.

#### [Request Example](#request-example-1)

```
curl -X POST "https://api.meetingbaas.com/calendars" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "refresh_token": "USER_REFRESH_TOKEN",
    "client_id": "YOUR_GOOGLE_CLIENT_ID",
    "client_secret": "YOUR_GOOGLE_CLIENT_SECRET",
    "raw_calendar_id": "team_calendar@group.calendar.google.com"  // Optional
  }'
```

If the `raw_calendar_id` parameter is not provided, Meeting BaaS will sync the user's primary calendar by default.

#### [Response Example](#response-example-1)

```
{
  "id": "cal_12345abcde",
  "provider": "google",
  "status": "syncing",
  "created_at": "2023-08-15T14:30:00Z",
  "raw_calendar_id": "team_calendar@group.calendar.google.com",
  "calendar_name": "Team Calendar"
}
```

Store the returned calendar ID safely - you'll need it for future operations.

### [Managing Calendars](#managing-calendars)

Once authenticated, you can manage your calendars as described in the [Managing Calendar Events](/docs/api/getting-started/calendars/events) guide.

After initial setup, Meeting BaaS handles all calendar API interactions. You only need to respond to webhook events for calendar changes, which are covered in the [webhooks guide](/docs/api/getting-started/calendars/webhooks).

Calendar integrations can have the following status values:

-   `syncing` - Initial sync in progress
-   `active` - Calendar is actively syncing
-   `error` - Sync encountered an error (check the `error_message` field)
-   `disconnected` - The calendar connection has been terminated

## [Next Steps](#next-steps)

Now that you've set up your calendar integration:

-   Learn how to [manage calendar events and recordings](/docs/api/getting-started/calendars/events)
-   Set up [webhooks for calendar updates](/docs/api/getting-started/calendars/webhooks)
-   Explore our [main API documentation](/docs/api) for other features

[

Previous

Calendar Synchronization

](/docs/api/getting-started/calendars)[

Next

Events

](/docs/api/getting-started/calendars/events)

### On this page

[

Prerequisites](#prerequisites)[

Authentication: Get your OAuth credentials](#authentication-get-your-oauth-credentials)[

Required OAuth Scopes](#required-oauth-scopes)[

Optional: List Raw Calendars](#optional-list-raw-calendars)[

Request Example](#request-example)[

Response Example](#response-example)[

Create a Calendar Integration](#create-a-calendar-integration)[

Request Example](#request-example-1)[

Response Example](#response-example-1)[

Managing Calendars](#managing-calendars)[

Next Steps](#next-steps)

Ask AI

---



## Calendar Events

Events | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

[

Setup](/docs/api/getting-started/calendars/setup)[

Events](/docs/api/getting-started/calendars/events)[

Webhooks](/docs/api/getting-started/calendars/webhooks)[

Maintenance](/docs/api/getting-started/calendars/maintenance)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/calendars/events/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started/[Calendar Synchronization](/docs/api/getting-started/calendars)

# Events

Work with calendar events and schedule recordings

After [setting up your calendar integration](/docs/api/getting-started/calendars/setup), you can work with calendar events and schedule recordings. This guide explains how to manage calendar events through the Meeting BaaS API.

## [Event Management](#event-management)

### [Listing and Retrieving Events](#listing-and-retrieving-events)

Monitor and manage calendar events:

-   List Events: [List Events](/docs/api/reference/calendars/list_events) - See all upcoming meetings
-   Get Event Details: [Get Event Details](/docs/api/reference/calendars/get_event) - View meeting info and bot status

#### [List Events Example](#list-events-example)

```
curl -X GET "https://api.meetingbaas.com/calendars/cal_12345abcde/events" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date_gte": "2023-09-01T00:00:00Z",
    "start_date_lte": "2023-09-08T23:59:59Z",
    "updated_at_gte": "2023-08-29T18:30:00Z"  // Optional, for webhook integration
  }'
```

The List Events endpoint supports various filtering options:

-   `calendar_id` (required) - Which calendar's events to retrieve
    
-   `start_date_gte` - Filter events starting on or after this timestamp
    
-   `start_date_lte` - Filter events starting on or before this timestamp
    
-   `updated_at_gte` - Filter events updated on or after this timestamp
    
-   `status` - Filter by meeting status ("upcoming", "past", "all") - default is "upcoming"
    
-   `attendee_email` - Filter events with a specific attendee
    
-   `organizer_email` - Filter events with a specific organizer
    
-   `cursor` - For pagination through large result sets
    

See the [List Events API Reference](/docs/api-reference/calendars/list_events) for full details.

#### [Get Event Details Example](#get-event-details-example)

```
curl -X GET "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### [Understanding Meeting Links](#understanding-meeting-links)

Meeting BaaS automatically detects meeting links within calendar events and can deploy bots based on your configuration.

Meeting links are detected from the event location, description, or custom properties depending on the calendar provider, habits or integrations of the user.

Each platform has its own link format that our system automatically recognizes.

### [Recording Management](#recording-management)

You can schedule or cancel recording events for specific calendar events:

-   Schedule Recording: [Schedule Record Event](/docs/api/reference/calendars/schedule_record_event) - Configure a bot to record a specific event
-   Cancel Recording: [Unschedule Record Event](/docs/api/reference/calendars/unschedule_record_event) - Cancel a scheduled recording

#### [Schedule Recording Example](#schedule-recording-example)

```
curl -X POST "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij/record" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recording_mode": "speaker_view",
    "include_transcription": true,
    "bot_name": "Recording Bot",
    "bot_avatar_url": "https://example.com/avatar.png",
    "entry_message": "This meeting is being recorded for note-taking purposes."
  }'
```

When scheduling a recording, the bot will automatically join the meeting at the scheduled time and begin recording based on your configuration.

### [Recording Options](#recording-options)

The recording configuration supports the same options as manual bot deployment:

#### [Visual Recording Options:](#visual-recording-options)

-   `speaker_view` - Records the active speaker (default)
-   `gallery_view` - Records all participants in a grid layout
-   `audio_only` - Records only the audio from the meeting

#### [Additional Features:](#additional-features)

-   `include_transcription: true|false` - Generate speech-to-text transcription
-   `bot_name: "string"` - Custom name for the bot in the meeting
-   `bot_avatar_url: "url"` - Custom profile picture for the bot
-   `entry_message: "string"` - Message the bot will send upon joining

#### [Canceling a Scheduled Recording](#canceling-a-scheduled-recording)

To cancel a scheduled recording:

```
curl -X DELETE "https://api.meetingbaas.com/calendars/cal_12345abcde/events/evt_67890fghij/record" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Remember to handle webhook notifications to track the recording status and receive the final recording data. These updates can be used to determine whether to record new or updated meetings.

## [Next Steps](#next-steps)

Now that you understand how to work with calendar events:

-   Learn about [webhooks for calendar updates](/docs/api/getting-started/calendars/webhooks)
-   Explore [custom meeting bot configurations](/docs/api/getting-started/sending-a-bot)
-   Check out our [Live Meeting Updates](/docs/api/getting-started/getting-the-data) system

[

Previous

Setup

](/docs/api/getting-started/calendars/setup)[

Next

Webhooks

](/docs/api/getting-started/calendars/webhooks)

### On this page

[

Event Management](#event-management)[

Listing and Retrieving Events](#listing-and-retrieving-events)[

List Events Example](#list-events-example)[

Get Event Details Example](#get-event-details-example)[

Understanding Meeting Links](#understanding-meeting-links)[

Recording Management](#recording-management)[

Schedule Recording Example](#schedule-recording-example)[

Recording Options](#recording-options)[

Visual Recording Options:](#visual-recording-options)[

Additional Features:](#additional-features)[

Canceling a Scheduled Recording](#canceling-a-scheduled-recording)[

Next Steps](#next-steps)

Ask AI

---



## Calendar Webhooks

Webhooks | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

[

Setup](/docs/api/getting-started/calendars/setup)[

Events](/docs/api/getting-started/calendars/events)[

Webhooks](/docs/api/getting-started/calendars/webhooks)[

Maintenance](/docs/api/getting-started/calendars/maintenance)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/calendars/webhooks/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started/[Calendar Synchronization](/docs/api/getting-started/calendars)

# Webhooks

Receive real-time updates, handle errors, and maintain your calendar integrations

## [Webhook Integration](#webhook-integration)

### [Understanding Calendar Webhooks](#understanding-calendar-webhooks)

In addition to live meeting events via the [Live Meeting Updates](/docs/api/getting-started/getting-the-data), your Meeting BaaS webhook endpoint defined in your account will receive calendar sync events with the type `calendar.sync_events`. These events notify you about:

-   New meeting schedules
-   Meeting changes or cancellations
-   Calendar sync status updates

When a calendar change is detected, a webhook is sent to your registered endpoint. This allows you to take real-time actions, such as scheduling a recording for new meetings or updating your database.

### [Webhook Payload Structure](#webhook-payload-structure)

#### [Example Webhook Payload](#example-webhook-payload)

```
{
  "event": "calendar.sync_events",
  "data": {
    "calendar_id": "cal_12345abcde",
    "last_updated_ts": "2023-09-01T15:30:45Z",
    "affected_event_uuids": [
      "evt_67890fghij",
      "evt_12345abcde",
      "evt_98765zyxwv"
    ]
  }
}
```

The payload includes:

-   `event`: The type of webhook event (e.g., `calendar.sync_events`)
-   `data`: Contains the details about what changed:
    -   `calendar_id`: The ID of the calendar that had changes
    -   `last_updated_ts`: When the changes occurred (UTC timestamp)
    -   `affected_event_uuids`: Array of event IDs that were added, updated, or deleted

All webhook timestamps are in UTC format. Always process timestamps accordingly in your application.

### [Processing Webhook Updates](#processing-webhook-updates)

There are two approaches to processing calendar updates:

#### [1\. Using the last\_updated\_ts timestamp](#1-using-the-last_updated_ts-timestamp)

This approach gets all events updated after a certain timestamp:

```
app.post("/webhooks/meeting-baas", async (req, res) => {
  const event = req.body;
 
  // Acknowledge receipt immediately with 200 OK
  res.status(200).send("Webhook received");
 
  // Process the event asynchronously
  if (event.event === "calendar.sync_events") {
    try {
      // Fetch updated events
      const updatedEvents = await fetchUpdatedEvents(
        event.data.calendar_id,
        event.data.last_updated_ts
      );
 
      // Process each event based on your business logic
      for (const evt of updatedEvents) {
        if (shouldRecordMeeting(evt)) {
          await scheduleRecording(event.data.calendar_id, evt.id);
        } else if (wasRecordingScheduled(evt) && shouldCancelRecording(evt)) {
          await cancelRecording(event.data.calendar_id, evt.id);
        }
      }
    } catch (error) {
      // Log error and implement retry mechanism
      console.error("Failed to process calendar sync event", error);
      // Add to retry queue
    }
  }
});
```

#### [2\. More efficient approach using affected\_event\_uuids](#2-more-efficient-approach-using-affected_event_uuids)

This approach only processes the specific events that changed:

```
app.post("/webhooks/meeting-baas", async (req, res) => {
  const event = req.body;
 
  // Acknowledge receipt immediately with 200 OK
  res.status(200).send("Webhook received");
 
  // Process the event asynchronously
  if (
    event.event === "calendar.sync_events" &&
    event.data.affected_event_uuids &&
    event.data.affected_event_uuids.length > 0
  ) {
    try {
      // Process only the specific affected events
      for (const eventUuid of event.data.affected_event_uuids) {
        const eventDetails = await fetchEventDetails(
          event.data.calendar_id,
          eventUuid
        );
 
        // Apply your business logic
        if (shouldRecordMeeting(eventDetails)) {
          await scheduleRecording(event.data.calendar_id, eventUuid);
        } else if (
          wasRecordingScheduled(eventDetails) &&
          shouldCancelRecording(eventDetails)
        ) {
          await cancelRecording(event.data.calendar_id, eventUuid);
        }
      }
    } catch (error) {
      // Log error and implement retry mechanism
      console.error("Failed to process calendar sync event", error);
      // Add to retry queue
    }
  }
});
```

This allows you to:

-   Track all calendar changes in real-time
    
-   Decide whether to record new or modified meetings
    
-   Keep your system synchronized with the latest meeting data
    

Always return a 200 OK response promptly to acknowledge receipt of the webhook before processing the data. This prevents webhook retry mechanisms from sending duplicate events.

### [Webhook Best Practices](#webhook-best-practices)

#### [Idempotent Processing](#idempotent-processing)

Implement idempotent webhook processing - you may receive the same webhook multiple times in rare circumstances:

```
// Example of idempotent processing using a processed events cache
const processedEvents = new Set();
 
app.post("/webhooks/meeting-baas", async (req, res) => {
  const event = req.body;
  const eventId = `${event.event}-${event.data.calendar_id}-${event.data.last_updated_ts}`;
 
  // Always acknowledge receipt immediately
  res.status(200).send("Webhook received");
 
  // Skip if we've already processed this exact event
  if (processedEvents.has(eventId)) {
    console.log(`Skipping already processed event: ${eventId}`);
    return;
  }
 
  // Add to processed events before processing
  processedEvents.add(eventId);
 
  // Process the event...
  // ...
 
  // In a production environment, you would use a persistent store
  // like Redis or a database instead of an in-memory Set
});
```

#### [Retry Logic](#retry-logic)

Configure your webhook endpoint to process these real-time updates and implement appropriate retry logic for reliability:

```
async function processWithRetry(fn, maxRetries = 3, delay = 1000) {
  let retries = 0;
 
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
 
      if (retries >= maxRetries) {
        throw error;
      }
 
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, retries - 1))
      );
    }
  }
}
 
// Example usage
app.post("/webhooks/meeting-baas", async (req, res) => {
  // Always acknowledge receipt immediately
  res.status(200).send("Webhook received");
 
  // Process with retry logic
  try {
    await processWithRetry(async () => {
      // Your processing logic here
    });
  } catch (error) {
    console.error("Failed after multiple retries", error);
    // Log to monitoring system, add to dead letter queue, etc.
  }
});
```

## [Next Steps](#next-steps)

Now that you understand webhooks and error handling:

-   Learn how to [maintain and clean up your calendar integrations](/docs/api/getting-started/calendars/maintenance)

[

Previous

Events

](/docs/api/getting-started/calendars/events)[

Next

Maintenance

](/docs/api/getting-started/calendars/maintenance)

### On this page

[

Webhook Integration](#webhook-integration)[

Understanding Calendar Webhooks](#understanding-calendar-webhooks)[

Webhook Payload Structure](#webhook-payload-structure)[

Example Webhook Payload](#example-webhook-payload)[

Processing Webhook Updates](#processing-webhook-updates)[

1\. Using the last\_updated\_ts timestamp](#1-using-the-last_updated_ts-timestamp)[

2\. More efficient approach using affected\_event\_uuids](#2-more-efficient-approach-using-affected_event_uuids)[

Webhook Best Practices](#webhook-best-practices)[

Idempotent Processing](#idempotent-processing)[

Retry Logic](#retry-logic)[

Next Steps](#next-steps)

Ask AI

---



## Calendar Maintenance

Maintenance | Meeting BaaS

[

MeetingBaas API](/docs/api)[

Transcript Seeker](/docs/transcript-seeker)[

Speaking Bots](/docs/speaking-bots)[Github](https://github.com/Meeting-Baas)[Introduction](/docs/api)

Getting Started

[

Sending a bot](/docs/api/getting-started/sending-a-bot)[

Removing a Bot](/docs/api/getting-started/removing-a-bot)[

Getting the Data](/docs/api/getting-started/getting-the-data)

[

Calendar Synchronization](/docs/api/getting-started/calendars)

[

Setup](/docs/api/getting-started/calendars/setup)[

Events](/docs/api/getting-started/calendars/events)[

Webhooks](/docs/api/getting-started/calendars/webhooks)[

Maintenance](/docs/api/getting-started/calendars/maintenance)

API Reference

API Updates

[Community & Support](/docs/api/community-and-support)

[![Meeting BaaS](https://docs.meetingbaas.com/docs/api/getting-started/calendars/maintenance/_next/static/media/logo.2778c4fb.png)Meeting BaaS](/)

Search

⌘K

[](https://github.com/Meeting-Baas)

[MeetingBaas API](/docs/api)[Transcript Seeker](/docs/transcript-seeker)[Speaking Bots](/docs/speaking-bots)

On this page

Getting Started/[Calendar Synchronization](/docs/api/getting-started/calendars)

# Maintenance

Maintain your calendar integrations, handle errors, and clean up calendar accounts

## [Error Handling and Troubleshooting](#error-handling-and-troubleshooting)

### [Common Errors](#common-errors)

#### [OAuth Token Expiration](#oauth-token-expiration)

Both your app's credentials (service level) and user's credentials (user level) can expire or be revoked. If this happens *Calendar sync operations will start failing*.

##### [Detecting and fixing the issue](#detecting-and-fixing-the-issue)

1.  You can detect this by periodically checking the calendar status using the [Get Calendar](/docs/api/reference/calendars/get_calendar) endpoint
2.  The [Resync All Calendars](/docs/api/reference/calendars/resync_all_calendars) endpoint will return detailed error information for calendars with authentication issues
3.  You should implement a monitoring strategy using this route to detect these failures and prompt users to reconnect their calendars

When this occurs, you need to, depending on whether it is your app's credentials or the user's credentials that are expired, you have 2 choices:

User's credentials are expired

Prompt the user to reauthorize calendar access by:

1.  Updating your database to mark the calendar integration as requiring reauthorization
2.  Prompting the user to reconnect their calendar when they next access your application

Your app's credentials are expired

Reauthorize your app's credentials by:

1.  Requiring new app credentials as shown in the [Setup](/docs/api/getting-started/calendars/setup) guide and storing them in your database
2.  Patching the calendar integration with the new credentials using the [Update Calendar](/docs/api/reference/calendars/update_calendar) endpoint to update your app credentials while keeping the same user credentials

### [Rate Limiting Considerations](#rate-limiting-considerations)

Calendar APIs enforce rate limits. Meeting BaaS handles these gracefully, but if you encounter persistent sync issues, check:

1.  The frequency of your calendar operations
2.  The number of events being synced
3.  Other applications using the same OAuth credentials

For Google Workspace, you're limited to 1 million queries per day per project. For Microsoft, limits vary by subscription type.

If you're building a high-volume application, consider implementing these best practices:

-   Batch calendar operations where possible
-   Implement exponential backoff for retries
-   Monitor your API usage with logging and alerts
-   Consider using multiple projects for very high-volume needs

## [Maintenance and Cleanup](#maintenance-and-cleanup)

### [Removing Calendar Integrations](#removing-calendar-integrations)

To remove a calendar integration, use the [Delete Calendar](/docs/api/reference/calendars/delete_calendar) endpoint.

```
curl -X DELETE "https://api.meetingbaas.com/calendars/cal_12345abcde" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

This will:

1.  Stop syncing the calendar
2.  Cancel any scheduled recordings for events from this calendar
3.  Remove the calendar integration from your account

This operation does not revoke OAuth access. However MeetingBaaS will have completely deleted the calendar integration from your account and its records.

To completely remove access, users should also revoke access via Google or Microsoft security settings. users should also revoke access via Google or Microsoft security settings.

## [Next Steps](#next-steps)

Now that you've mastered calendar synchronization:

-   Learn about [custom meeting bot configurations](/docs/api/getting-started/sending-a-bot)
-   Explore our [Live Meeting Updates](/docs/api/getting-started/getting-the-data) for real-time meeting data
-   Check out our [Community & Support](/docs/api/getting-started/community-support) resources

[

Previous

Webhooks

](/docs/api/getting-started/calendars/webhooks)[

Next

List Bots with Metadata GET

](/docs/api/reference/bots_with_metadata)

### On this page

[

Error Handling and Troubleshooting](#error-handling-and-troubleshooting)[

Common Errors](#common-errors)[

OAuth Token Expiration](#oauth-token-expiration)[

Detecting and fixing the issue](#detecting-and-fixing-the-issue)[

Rate Limiting Considerations](#rate-limiting-considerations)[

Maintenance and Cleanup](#maintenance-and-cleanup)[

Removing Calendar Integrations](#removing-calendar-integrations)[

Next Steps](#next-steps)

Ask AI

---

