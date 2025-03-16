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