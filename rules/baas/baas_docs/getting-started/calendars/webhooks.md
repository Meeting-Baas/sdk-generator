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