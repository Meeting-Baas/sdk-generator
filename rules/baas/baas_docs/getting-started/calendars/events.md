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