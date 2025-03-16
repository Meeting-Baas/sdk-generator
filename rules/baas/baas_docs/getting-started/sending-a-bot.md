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