/**
 * Example MPC Tool Templates
 *
 * These templates are used by the tools generator to understand the structure
 * and patterns of MPC tools. The code generation LLM will use these as a reference.
 * THE LLM MUST INCLUDE SCHEMAS FOR ALL TOOLS
 */

import { BaasClient } from '../baas/client';
import {
  BotParam2,
  Calendar,
  Event,
  Provider,
  RecordingMode,
  SpeechToText,
  SpeechToTextProvider,
  Transcript,
  Word,
  JoinRequest,
  CreateCalendarParams,
  Metadata
} from "../generated/baas/models";
import * as MpcTools from "../mpc/tools";
import { ToolDefinition } from "../mpc/types";
import { Configuration } from "../generated/baas/configuration";

// Define a generic calendar event type for example purposes
interface CalendarEvent {
  uuid: string;
  name: string;
  start_time: number | string;
  end_time: number | string;
  meeting_url?: string;
  calendar_uuid?: string;
  bot_param?: any;
}

// Example 1: Simple tool with a single parameter
export const join_meeting_tool: ToolDefinition = MpcTools.createTool(
  "join_meeting",
  "Have a bot join a meeting and start recording",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_name",
      "The display name of the bot in the meeting",
      true
    ),
    MpcTools.createStringParameter(
      "meeting_url",
      "The URL of the meeting to join (Zoom, Google Meet, or Microsoft Teams)",
      true
    ),
    MpcTools.createBooleanParameter(
      "reserved",
      "Whether to reserve a bot (true) or use one from the pool (false)",
      true
    ),
    MpcTools.createStringParameter(
      "webhook_url",
      "Optional URL to receive webhook notifications about the bot",
      false
    ),
    MpcTools.createStringParameter(
      "bot_image",
      "Optional URL to an image for the bot avatar",
      false
    ),
    MpcTools.createStringParameter(
      "entry_message",
      "Optional message for the bot to send upon joining",
      false
    ),
    MpcTools.createEnumParameter(
      "recording_mode",
      ["speaker_view", "gallery_view", "audio_only"],
      "Which recording mode to use (defaults to speaker_view)",
      false
    ),
    MpcTools.createObjectParameter(
      "speech_to_text",
      {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
          description: "Which speech-to-text provider to use",
        },
        api_key: {
          type: "string",
          description: "API key for the speech-to-text provider (if required)",
        },
      },
      "Speech-to-text configuration (optional)",
      false
    ),
    MpcTools.createNumberParameter(
      "start_time",
      "Optional UNIX timestamp (in ms) of when the meeting starts",
      false
    ),
    MpcTools.createObjectParameter(
      "extra",
      {
        additionalProperties: true,
      },
      "Optional additional metadata for the meeting",
      false
    ),
  ]
);

// Add JSON schema for validation
export const join_meeting_schema = {
  type: "object",
  properties: {
    api_key: { type: "string" },
    bot_name: { type: "string" },
    meeting_url: { type: "string" },
    reserved: { type: "boolean" },
    webhook_url: { type: "string" },
    bot_image: { type: "string" },
    entry_message: { type: "string" },
    recording_mode: {
      type: "string",
      enum: ["speaker_view", "gallery_view", "audio_only"],
    },
    speech_to_text: {
      type: "object",
      properties: {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
        },
        api_key: { type: "string" },
      },
    },
    start_time: { type: "number" },
    extra: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["api_key", "bot_name", "meeting_url", "reserved"],
};

// Example of a tool execution function
export async function executeJoinMeeting(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key
    });

    // Convert from snake_case tool parameters to camelCase SDK parameters
    const result = await client.joinMeeting({
      bot_name: args.bot_name,
      meeting_url: args.meeting_url,
      reserved: args.reserved,
      webhook_url: args.webhook_url,
      bot_image: args.bot_image,
      entry_message: args.entry_message,
      recording_mode: args.recording_mode as RecordingMode,
      speech_to_text: args.speech_to_text as SpeechToText,
      start_time: args.start_time,
      extra: args.extra
    });

    return `Successfully joined the meeting with bot ID: ${result}`;
  } catch (error) {
    return `Error joining meeting: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 2: Simple tool with a string parameter
export const leave_meeting_tool: ToolDefinition = MpcTools.createTool(
  "leave_meeting",
  "Have a bot leave a meeting it has joined",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_id",
      "The ID of the bot to remove from the meeting",
      true
    ),
  ]
);

// Add JSON schema for validation
export const leave_meeting_schema = {
  type: "object",
  properties: {
    api_key: { type: "string" },
    bot_id: { type: "string" },
  },
  required: ["api_key", "bot_id"],
};

// Example of a tool execution function
export async function executeLeaveMeeting(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key
    });

    const result = await client.leaveMeeting();

    if (result) {
      return `Bot has successfully left the meeting.`;
    } else {
      return `Failed to remove the bot from the meeting.`;
    }
  } catch (error) {
    return `Error leaving meeting: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 3: Calendar integration tool with multiple parameters
export const create_calendar_tool: ToolDefinition = MpcTools.createTool(
  "create_calendar",
  "Integrate a calendar using OAuth credentials",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "oauth_client_id",
      "OAuth client ID from Google Cloud Console or Microsoft Azure",
      true
    ),
    MpcTools.createStringParameter(
      "oauth_client_secret",
      "OAuth client secret from Google Cloud Console or Microsoft Azure",
      true
    ),
    MpcTools.createStringParameter(
      "oauth_refresh_token",
      "OAuth refresh token obtained after the user grants calendar access",
      true
    ),
    MpcTools.createEnumParameter(
      "platform",
      ["Google", "Microsoft"],
      "The calendar provider platform",
      true
    ),
    MpcTools.createStringParameter(
      "raw_calendar_id",
      "Optional ID of a specific calendar to integrate",
      false
    ),
  ]
);

// Example of a tool execution function
export async function executeCreateCalendar(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    const result = await client.createCalendar({
      oauth_client_id: args.oauth_client_id,
      oauth_client_secret: args.oauth_client_secret,
      oauth_refresh_token: args.oauth_refresh_token,
      platform: args.platform as Provider,
      raw_calendar_id: args.raw_calendar_id,
    });

    return `Calendar successfully integrated!\n\nDetails:\nName: ${result.calendar.name}\nEmail: ${result.calendar.email}\nUUID: ${result.calendar.uuid}`;
  } catch (error) {
    return `Error setting up calendar: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 4: Complex tool for scheduling recordings for calendar events
export const schedule_record_event_tool: ToolDefinition = MpcTools.createTool(
  "schedule_record_event",
  "Schedule a bot to record a specific calendar event",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "event_uuid",
      "The UUID of the calendar event to record",
      true
    ),
    MpcTools.createStringParameter(
      "bot_name",
      "The display name of the bot in the meeting",
      true
    ),
    MpcTools.createStringParameter(
      "webhook_url",
      "Optional URL to receive webhook notifications about the bot",
      false
    ),
    MpcTools.createStringParameter(
      "bot_image",
      "Optional URL to an image for the bot avatar",
      false
    ),
    MpcTools.createEnumParameter(
      "recording_mode",
      ["speaker_view", "gallery_view", "audio_only"],
      "Which recording mode to use (defaults to speaker_view)",
      false
    ),
    MpcTools.createObjectParameter(
      "speech_to_text",
      {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
          description: "Which speech-to-text provider to use",
        },
        api_key: {
          type: "string",
          description: "API key for the speech-to-text provider (if required)",
        },
      },
      "Speech-to-text configuration (optional)",
      false
    ),
    MpcTools.createBooleanParameter(
      "all_occurrences",
      "Whether to schedule recording for all occurrences of a recurring event",
      false
    ),
    MpcTools.createObjectParameter(
      "extra",
      {
        additionalProperties: true,
      },
      "Optional additional metadata for the recording",
      false
    ),
  ]
);

// Add JSON schema for validation
export const schedule_record_event_schema = {
  type: "object",
  properties: {
    api_key: { type: "string" },
    event_uuid: { type: "string" },
    bot_name: { type: "string" },
    webhook_url: { type: "string" },
    bot_image: { type: "string" },
    recording_mode: {
      type: "string",
      enum: ["speaker_view", "gallery_view", "audio_only"],
    },
    speech_to_text: {
      type: "object",
      properties: {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
        },
        api_key: { type: "string" },
      },
    },
    all_occurrences: { type: "boolean" },
    extra: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["api_key", "event_uuid", "bot_name"],
};

// Example of a complex tool execution function with formatted response
export async function executeScheduleRecordEvent(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Prepare bot parameters for the API
    const botParams: BotParam2 = {
      bot_name: args.bot_name,
      webhook_url: args.webhook_url || undefined,
      bot_image: args.bot_image || undefined,
      recording_mode: (args.recording_mode as RecordingMode) || undefined,
      extra: args.extra || {},
    };

    // Add speech to text if provided
    if (args.speech_to_text) {
      botParams.speech_to_text = {
        provider: args.speech_to_text.provider as SpeechToTextProvider,
        api_key: args.speech_to_text.api_key,
      };
    }

    // Call the SDK method - assuming the client has this method
    // This is an example for the AI model - the actual method name or parameters may differ
    const events = (await (client as any).scheduleRecordEvent(
      args.event_uuid,
      botParams,
      args.all_occurrences
    )) as Event[];

    // Format a user-friendly response
    if (!events || events.length === 0) {
      return "No events were scheduled for recording.";
    }

    if (events.length === 1) {
      const event = events[0];
      return `Successfully scheduled recording for event "${event.name}"
      
Event details:
- Start time: ${new Date(event.start_time).toLocaleString()}
- End time: ${new Date(event.end_time).toLocaleString()}
- Meeting URL: ${event.meeting_url || "Not available"}
- Calendar: ${event.calendar_uuid}
- Bot name: ${args.bot_name}

The bot will automatically join this meeting at the scheduled time.`;
    } else {
      return `Successfully scheduled recordings for ${
        events.length
      } occurrences of the recurring event.

The first 3 occurrences:
${events
  .slice(0, 3)
  .map(
    (event: Event, i: number) =>
      `${i + 1}. "${event.name}" on ${new Date(
        event.start_time
      ).toLocaleString()}`
  )
  .join("\n")}

${events.length > 3 ? `...and ${events.length - 3} more occurrences.\n` : ""}
All recordings will use bot name: ${args.bot_name}`;
    }
  } catch (error) {
    return `Error scheduling event recording: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 5: API endpoint that returns complex data
export const get_meeting_data_tool: ToolDefinition = MpcTools.createTool(
  "get_meeting_data",
  "Retrieve meeting recording, transcription and metadata for a bot",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_id",
      "The ID of the bot to retrieve data for",
      true
    ),
  ]
);

// Add JSON schema for validation
export const get_meeting_data_schema = {
  type: "object",
  properties: {
    api_key: { type: "string" },
    bot_id: { type: "string" },
  },
  required: ["api_key", "bot_id"],
};

// Example of handling complex response data in a human-readable format
export async function executeGetMeetingData(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    const data = await client.getMeetingData(args.bot_id);

    if (!data) {
      return "No meeting data found for this bot ID.";
    }

    // Format the transcripts for better readability
    const transcriptSummary =
      data.bot_data.transcripts.length > 0
        ? data.bot_data.transcripts
            .map((transcript: Transcript, i: number) => {
              return `${i + 1}. ${transcript.speaker} (${formatTime(
                transcript.start_time
              )}): "${transcript.words.map((w: Word) => w.text).join(" ")}"`;
            })
            .join("\n\n")
            .substring(0, 1000) // Limit length
        : "No transcriptions available";

    // Add ellipsis if transcripts were truncated
    const transcriptEllipsis =
      data.bot_data.transcripts.length > 0 && transcriptSummary.length >= 1000
        ? "\n\n... (transcript truncated)"
        : "";

    return `Meeting Data for Bot ID: ${args.bot_id}

Recording URL: ${data.mp4 || "Not available"}
Duration: ${formatDuration(data.duration)}
Deleted: ${data.content_deleted ? "Yes" : "No"}

Bot Details:
- Name: ${data.bot_data.bot.bot_name}
- Meeting URL: ${data.bot_data.bot.meeting_url}
- Created: ${new Date(data.bot_data.bot.created_at).toLocaleString()}
- Ended: ${
      data.bot_data.bot.ended_at
        ? new Date(data.bot_data.bot.ended_at).toLocaleString()
        : "Still active or information not available"
    }

Transcripts (${data.bot_data.transcripts.length} segments):
${transcriptSummary}${transcriptEllipsis}`;
  } catch (error) {
    return `Error retrieving meeting data: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 6: Get meeting transcript with formatted output
export const get_meeting_transcript_tool: ToolDefinition = MpcTools.createTool(
  "get_meeting_transcript",
  "Get a meeting transcript with speaker names and content grouped by speaker",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_id",
      "The ID of the bot/meeting to retrieve transcript for",
      true
    ),
  ]
);

// Example of getting a transcript and formatting it nicely
export async function executeGetMeetingTranscript(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Get meeting data from the API
    const response = await client.getMeetingData(args.bot_id);

    // Check for valid response structure
    if (!response || !response.bot_data) {
      return "Error: Invalid response structure from API.";
    }

    // Extract meeting information
    const meetingInfo = {
      name: response.bot_data.bot?.bot_name || "Unknown Meeting",
      url: response.bot_data.bot?.meeting_url || "Unknown URL",
      duration: response.duration || 0,
    };

    // Extract transcripts from the response
    const transcripts = response.bot_data.transcripts || [];

    // If no transcripts, provide info about the meeting
    if (transcripts.length === 0) {
      return `Meeting "${meetingInfo.name}" has a recording (${Math.floor(
        meetingInfo.duration / 60
      )}m ${
        meetingInfo.duration % 60
      }s), but no transcript segments are available.`;
    }

    // Group and combine text by speaker
    const speakerTexts: Record<string, string[]> = {};

    // Collect all text segments by speaker
    transcripts.forEach((segment: Transcript) => {
      const speaker = segment.speaker;
      // Check that words array exists and has content
      if (!segment.words || !Array.isArray(segment.words)) {
        return;
      }

      const text = segment.words
        .map((word: Word) => word.text || "")
        .join(" ")
        .trim();
      if (!text) return; // Skip empty text

      if (!speakerTexts[speaker]) {
        speakerTexts[speaker] = [];
      }

      speakerTexts[speaker].push(text);
    });

    // If after processing we have no text, provide info
    if (Object.keys(speakerTexts).length === 0) {
      return `Meeting "${meetingInfo.name}" has a recording (${Math.floor(
        meetingInfo.duration / 60
      )}m ${
        meetingInfo.duration % 60
      }s), but could not extract readable transcript.`;
    }

    // Combine all text segments per speaker
    const combinedBySpeaker = Object.entries(speakerTexts).map(
      ([speaker, texts]) => {
        return {
          speaker,
          text: texts.join(" "),
        };
      }
    );

    // Format the transcript grouped by speaker
    const formattedTranscript = combinedBySpeaker
      .map((entry) => `${entry.speaker}: ${entry.text}`)
      .join("\n\n");

    // Add meeting info header
    const header = `Meeting: "${meetingInfo.name}"\nDuration: ${Math.floor(
      meetingInfo.duration / 60
    )}m ${meetingInfo.duration % 60}s\nTranscript:\n\n`;

    return header + formattedTranscript;
  } catch (error) {
    return `Error getting transcript: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 7: Search in meeting transcript for keywords or phrases
export const search_meeting_transcript_tool: ToolDefinition =
  MpcTools.createTool(
    "search_meeting_transcript",
    "Search through a meeting transcript for specific keywords or phrases",
    [
      MpcTools.createStringParameter(
        "api_key",
        "Your Meeting BaaS API key",
        true
      ),
      MpcTools.createStringParameter(
        "bot_id",
        "The ID of the bot/meeting to search in",
        true
      ),
      MpcTools.createStringParameter(
        "query",
        "Keywords or phrase to search for in the transcript",
        true
      ),
      MpcTools.createBooleanParameter(
        "case_sensitive",
        "Whether the search should be case sensitive (defaults to false)",
        false
      ),
      MpcTools.createNumberParameter(
        "context_seconds",
        "Number of seconds of context to include before and after matches (defaults to 10)",
        false
      ),
    ]
  );

// Example of searching in a transcript and returning matches with context
export async function executeSearchMeetingTranscript(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Get meeting data from the API
    const response = await client.getMeetingData(args.bot_id);

    // Check if we have a valid meeting with transcripts
    if (!response || !response.bot_data || !response.bot_data.transcripts) {
      return "No transcript found for this meeting.";
    }

    const transcripts = response.bot_data.transcripts;
    if (transcripts.length === 0) {
      return "This meeting has no transcript segments to search through.";
    }

    // Prepare the search
    const query = args.case_sensitive ? args.query : args.query.toLowerCase();
    const contextSeconds = args.context_seconds || 10;
    const matches: any[] = [];

    // Search through all transcript segments
    transcripts.forEach((segment: Transcript) => {
      // Skip segments without words
      if (
        !segment.words ||
        !Array.isArray(segment.words) ||
        segment.words.length === 0
      ) {
        return;
      }

      // Get the full text of this segment
      const segmentText = segment.words
        .map((word: Word) => word.text)
        .join(" ");
      const textToSearch = args.case_sensitive
        ? segmentText
        : segmentText.toLowerCase();

      // Check if this segment contains the query
      if (textToSearch.includes(query)) {
        matches.push({
          timestamp: segment.start_time,
          speaker: segment.speaker,
          text: segmentText,
          // Include any other metadata that might be useful
          segment_start: segment.start_time,
          segment_end: segment.end_time,
        });
      }
    });

    // If no matches, return a message
    if (matches.length === 0) {
      return `No matches found for "${args.query}" in the transcript.`;
    }

    // Sort matches by timestamp
    matches.sort((a, b) => a.timestamp - b.timestamp);

    // Format the results
    const meetingName = response.bot_data.bot?.bot_name || "Unknown Meeting";
    const formattedMatches = matches
      .map((match, index) => {
        // Format timestamp as mm:ss
        const minutes = Math.floor(match.timestamp / 60);
        const seconds = Math.floor(match.timestamp % 60);
        const formattedTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

        return `Match ${index + 1} (${formattedTime}): ${match.speaker}
"${match.text}"`;
      })
      .join("\n\n");

    return `Found ${matches.length} matches for "${args.query}" in meeting "${meetingName}":\n\n${formattedMatches}`;
  } catch (error) {
    return `Error searching transcript: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 8: List upcoming meetings from a calendar
export const list_upcoming_meetings_tool: ToolDefinition = MpcTools.createTool(
  "list_upcoming_meetings",
  "List upcoming meetings from a calendar",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "calendar_id",
      "UUID of the calendar to query",
      true
    ),
    MpcTools.createEnumParameter(
      "status",
      ["upcoming", "past", "all"],
      "Filter for meeting status (defaults to upcoming)",
      false
    ),
    MpcTools.createNumberParameter(
      "limit",
      "Maximum number of events to return (1-100, defaults to 20)",
      false
    ),
  ]
);

// Example of listing upcoming meetings from a calendar
export async function executeListUpcomingMeetings(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Set default values
    const status = args.status || "upcoming";
    const limit = args.limit || 20;

    // Get events from the calendar
    // Note: This is a mock implementation - the actual client may not have this exact method
    // Use type assertion to avoid TypeScript errors in this example
    const response = await (client as any).listEvents(args.calendar_id, {
      status: status,
      limit: limit,
    });

    // Handle case with no events
    if (!response.data || response.data.length === 0) {
      return `No ${status} meetings found in this calendar.`;
    }

    // Process the events
    const meetings = response.data.slice(0, limit);

    // Format the meeting list
    const meetingList = meetings
      .map((meeting: CalendarEvent) => {
        const startTime =
          typeof meeting.start_time === "number"
            ? new Date(meeting.start_time).toLocaleString()
            : new Date(meeting.start_time as string).toLocaleString();
        const hasBot = meeting.bot_param ? "🤖 Bot scheduled" : "";
        const meetingLink = meeting.meeting_url
          ? `Link: ${meeting.meeting_url}`
          : "";

        return `- ${meeting.name} [${startTime}] ${hasBot} ${meetingLink} [ID: ${meeting.uuid}]`;
      })
      .join("\n");

    // Add pagination info if needed
    let result = `${
      status.charAt(0).toUpperCase() + status.slice(1)
    } meetings:\n\n${meetingList}`;

    if (response.next) {
      result += `\n\nMore meetings available. Use 'cursor: ${response.next}' to see more.`;
    }

    return result;
  } catch (error) {
    return `Error listing meetings: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 9: Find key moments in a meeting
export const find_key_moments_tool: ToolDefinition = MpcTools.createTool(
  "find_key_moments",
  "Automatically find and share key moments and topics from a meeting recording",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_id",
      "ID of the bot that recorded the meeting",
      true
    ),
    MpcTools.createStringParameter(
      "meeting_title",
      "Title of the meeting (optional)",
      false
    ),
    MpcTools.createArrayParameter(
      "topics",
      { type: "string" },
      "List of topics to look for in the meeting (optional)",
      false
    ),
    MpcTools.createNumberParameter(
      "max_moments",
      "Maximum number of key moments to find (defaults to 5)",
      false
    ),
    MpcTools.createEnumParameter(
      "granularity",
      ["high", "medium", "low"],
      "Level of detail for topic extraction (defaults to medium)",
      false
    ),
  ]
);

// Example of finding key moments in a meeting transcript
export async function executeFindKeyMoments(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Get the meeting data
    const response = await client.getMeetingData(args.bot_id);

    // Check if we have a valid response
    if (!response?.bot_data?.bot) {
      return `Could not find meeting data for the provided bot ID: ${args.bot_id}`;
    }

    const meetingTitle =
      args.meeting_title ||
      response.bot_data.bot.bot_name ||
      "Meeting Recording";
    const transcripts = response.bot_data.transcripts || [];

    if (transcripts.length === 0) {
      return `No transcript found for meeting "${meetingTitle}". Cannot extract key moments without a transcript.`;
    }

    // Set default values
    const maxMoments = args.max_moments || 5;
    const granularity = args.granularity || "medium";

    // Analyze transcripts to find key moments
    // This is simplified logic - in a real implementation,
    // we would use more sophisticated NLP techniques

    // Sort transcripts chronologically
    const sortedTranscripts = [...transcripts].sort(
      (a, b) => Number(a.start_time) - Number(b.start_time)
    );

    // Find potential key moments based on simple heuristics
    const keyMoments: Array<{
      timestamp: number;
      speaker: string;
      description: string;
      text: string;
    }> = [];

    // Check for start of meeting
    if (sortedTranscripts.length > 0) {
      const firstTranscript = sortedTranscripts[0];
      keyMoments.push({
        timestamp: Number(firstTranscript.start_time),
        speaker: firstTranscript.speaker,
        description: "Meeting start",
        text: firstTranscript.words?.map((w: Word) => w.text).join(" ") || "",
      });
    }

    // Look for important moments in the transcript
    const importantTerms = [
      "conclusion",
      "summary",
      "action item",
      "next steps",
      "decision",
      "agree",
      "important",
    ];

    // Scan through transcripts for important terms
    for (let i = 1; i < sortedTranscripts.length - 1; i++) {
      const transcript = sortedTranscripts[i];
      const text = transcript.words?.map((w: Word) => w.text).join(" ") || "";

      // Check if this segment contains any important terms
      const containsImportantTerm = importantTerms.some((term) =>
        text.toLowerCase().includes(term.toLowerCase())
      );

      if (containsImportantTerm) {
        keyMoments.push({
          timestamp: Number(transcript.start_time),
          speaker: transcript.speaker,
          description: "Important discussion point",
          text: text,
        });
      }
    }

    // Add end of meeting
    if (sortedTranscripts.length > 1) {
      const lastTranscript = sortedTranscripts[sortedTranscripts.length - 1];
      keyMoments.push({
        timestamp: Number(lastTranscript.start_time),
        speaker: lastTranscript.speaker,
        description: "Meeting conclusion",
        text: lastTranscript.words?.map((w: Word) => w.text).join(" ") || "",
      });
    }

    // Limit to requested number of moments
    const finalMoments = keyMoments.slice(0, maxMoments);

    // Format key moments
    if (finalMoments.length === 0) {
      return `No key moments identified in meeting "${meetingTitle}".`;
    }

    // Format results
    const formattedMoments = finalMoments
      .map((moment, index) => {
        const minutes = Math.floor(moment.timestamp / 60);
        const seconds = Math.floor(moment.timestamp % 60);
        const formattedTime = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

        return `${index + 1}. ${moment.description} (${formattedTime})
Speaker: ${moment.speaker}
"${moment.text.substring(0, 150)}${moment.text.length > 150 ? "..." : ""}"`;
      })
      .join("\n\n");

    return `# Key Moments from "${meetingTitle}"\n\n${formattedMoments}`;
  } catch (error) {
    return `Error finding key moments: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 10: Delete meeting data
export const delete_meeting_data_tool: ToolDefinition = MpcTools.createTool(
  "delete_meeting_data",
  "Delete transcription, log files, and video recording, along with all data associated with a bot",
  [
    MpcTools.createStringParameter(
      "api_key",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "bot_id",
      "The ID of the bot to delete data for",
      true
    ),
  ]
);

// Example of deleting meeting data
export async function executeDeleteMeetingData(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Call the delete endpoint - this is a mock implementation
    // Use type assertion to avoid TypeScript errors in this example
    const response = await (client as any).deleteData(args.bot_id);

    // Handle the response based on the status
    const statusMessages: Record<string, string> = {
      deleted:
        "Successfully deleted all data. The meeting metadata (URL, timestamps, etc.) has been preserved, but all content (recordings, transcriptions, and logs) has been deleted.",
      partiallyDeleted:
        "Partially deleted data. Some content could not be removed, but most data has been deleted. The meeting metadata has been preserved.",
      alreadyDeleted: "Data was already deleted. No further action was needed.",
      noDataFound: "No data was found for the specified bot ID.",
    };

    // Return the appropriate message based on the status
    if (response && response.ok) {
      const status = response.status as string;
      return (
        statusMessages[status] ||
        `Successfully processed with status: ${status}`
      );
    } else {
      // Handle error responses
      if (response.status === 401) {
        return "Unauthorized: Missing or invalid API key.";
      } else if (response.status === 403) {
        return "Forbidden: You don't have permission to delete this bot's data.";
      } else if (response.status === 404) {
        return "Not found: The specified bot ID does not exist.";
      } else if (response.status === 429) {
        return "Rate limit exceeded: This endpoint is limited to 5 requests per minute per API key. Please try again later.";
      } else {
        return `Failed to delete data: ${JSON.stringify(response)}`;
      }
    }
  } catch (error) {
    // Check for rate limit error
    if (error instanceof Error && error.message.includes("429")) {
      return "Rate limit exceeded: This endpoint is limited to 5 requests per minute per API key. Please try again later.";
    }

    return `Error deleting data: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 11: List calendars
export const list_calendars_tool: ToolDefinition = MpcTools.createTool(
  "list_calendars",
  "List all calendars integrated with Meeting BaaS",
  [MpcTools.createStringParameter("api_key", "Your Meeting BaaS API key", true)]
);

// Example of listing calendars
export async function executeListCalendars(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.api_key,
    });

    // Call the API to list calendars - this is a mock implementation
    // Use type assertion to avoid TypeScript errors in this example
    const calendars = await (client as any).listCalendars();

    if (calendars.length === 0) {
      return "No calendars found. You can add a calendar using the create_calendar tool.";
    }

    // Format the calendar list
    const calendarList = calendars
      .map((cal: Calendar) => `- ${cal.name} (${cal.email}) [ID: ${cal.uuid}]`)
      .join("\n");

    return `Found ${calendars.length} calendars:\n\n${calendarList}`;
  } catch (error) {
    return `Error listing calendars: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Helper functions for formatting
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  if (!seconds) return "Unknown";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
}

// Example of a simple tool that joins a meeting
export const joinMeetingTool: ToolDefinition = MpcTools.createTool(
  'join-meeting',
  'Joins a meeting with a bot',
  [
    MpcTools.createStringParameter(
      'apiKey',
      'API key for authentication',
      true
    ),
    MpcTools.createStringParameter(
      'meetingUrl',
      'URL of the meeting to join',
      true
    ),
    MpcTools.createStringParameter(
      'botName',
      'Name of the bot to use',
      true
    ),
    MpcTools.createBooleanParameter(
      'reserved',
      'Whether to use a reserved bot',
      true
    ),
    MpcTools.createStringParameter(
      'webhookUrl',
      'Optional webhook URL for notifications',
      false
    ),
    MpcTools.createStringParameter(
      'botImage',
      'Optional URL for bot avatar image',
      false
    ),
    MpcTools.createStringParameter(
      'entryMessage',
      'Optional message to send when joining',
      false
    ),
    MpcTools.createEnumParameter(
      'recordingMode',
      ['speaker_view', 'gallery_view', 'audio_only'],
      'Optional recording mode',
      false
    ),
    MpcTools.createObjectParameter(
      'speechToText',
      {
        provider: {
          type: 'string',
          enum: ['Gladia', 'Runpod', 'Default'],
          description: 'Which speech-to-text provider to use',
        },
        api_key: {
          type: 'string',
          description: 'API key for the speech-to-text provider (if required)',
        },
      },
      'Optional speech-to-text configuration',
      false
    ),
    MpcTools.createNumberParameter(
      'startTime',
      'Optional start time in milliseconds',
      false
    ),
    MpcTools.createObjectParameter(
      'extra',
      {
        additionalProperties: true,
      },
      'Optional extra data',
      false
    )
  ]
);

// Example of a tool that leaves a meeting
export const leaveMeetingTool: ToolDefinition = MpcTools.createTool(
  'leave-meeting',
  'Leaves a meeting',
  [
    MpcTools.createStringParameter(
      'apiKey',
      'API key for authentication',
      true
    )
  ]
);

// Example of a tool that creates a calendar
export const createCalendarTool: ToolDefinition = MpcTools.createTool(
  'create-calendar',
  'Creates a new calendar integration',
  [
    MpcTools.createStringParameter(
      'apiKey',
      'API key for authentication',
      true
    ),
    MpcTools.createEnumParameter(
      'platform',
      ['Google', 'Microsoft'],
      'Calendar platform (Google or Microsoft)',
      true
    ),
    MpcTools.createStringParameter(
      'oauthClientId',
      'OAuth client ID',
      true
    ),
    MpcTools.createStringParameter(
      'oauthClientSecret',
      'OAuth client secret',
      true
    ),
    MpcTools.createStringParameter(
      'oauthRefreshToken',
      'OAuth refresh token',
      true
    ),
    MpcTools.createStringParameter(
      'rawCalendarId',
      'Optional raw calendar ID',
      false
    )
  ]
);

// Example of a tool that gets meeting data
export const getMeetingDataTool: ToolDefinition = MpcTools.createTool(
  'get-meeting-data',
  'Gets data for a specific meeting',
  [
    MpcTools.createStringParameter(
      'apiKey',
      'API key for authentication',
      true
    ),
    MpcTools.createStringParameter(
      'botId',
      'ID of the bot to get data for',
      true
    )
  ]
);
