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