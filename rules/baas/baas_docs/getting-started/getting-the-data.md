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