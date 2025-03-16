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