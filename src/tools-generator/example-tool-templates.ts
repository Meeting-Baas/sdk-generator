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
import { Tool } from '../types/tool';

// Define a generic calendar event type for example purposes
interface CalendarEvent {
  uuid: string;
  name: string;
  startTime: number | string;
  endTime: number | string;
  meetingUrl?: string;
  calendarUuid?: string;
  botParam?: any;
}

// Example 1: Simple tool with a single parameter
export const joinMeetingTool: Tool = {
  name: 'joinMeeting',
  description: 'Join a meeting with a bot',
  parameters: {
    type: 'object',
    properties: {
      meetingUrl: {
        type: 'string',
        description: 'The URL of the meeting to join'
      },
      botName: {
        type: 'string',
        description: 'The name of the bot to use'
      },
      botConfig: {
        type: 'object',
        description: 'Configuration for the bot',
        properties: {
          language: {
            type: 'string',
            description: 'The language the bot should use'
          },
          voice: {
            type: 'string',
            description: 'The voice to use for the bot'
          },
          behavior: {
            type: 'string',
            description: 'The behavior mode for the bot'
          }
        }
      }
    },
    required: ['meetingUrl', 'botName']
  }
};

// Add JSON schema for validation
export const joinMeetingSchema = {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    botName: { type: "string" },
    meetingUrl: { type: "string" },
    reserved: { type: "boolean" },
    webhookUrl: { type: "string" },
    botImage: { type: "string" },
    entryMessage: { type: "string" },
    recordingMode: {
      type: "string",
      enum: ["speaker_view", "gallery_view", "audio_only"],
    },
    speechToText: {
      type: "object",
      properties: {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
        },
        apiKey: { type: "string" },
      },
    },
    startTime: { type: "number" },
    extra: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["apiKey", "botName", "meetingUrl", "reserved"],
};

// Example of a tool execution function
export async function executeJoinMeeting(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey
    });

    // Convert from snake_case tool parameters to camelCase SDK parameters
    const result = await client.joinMeeting({
      botName: args.botName,
      meetingUrl: args.meetingUrl,
      reserved: args.reserved,
      webhookUrl: args.webhookUrl,
      botImage: args.botImage,
      entryMessage: args.entryMessage,
      recordingMode: args.recordingMode,
      speechToText: args.speechToText,
      startTime: args.startTime,
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
export const leaveMeetingTool: ToolDefinition = MpcTools.createTool(
  "leave-meeting",
  "Leaves a meeting",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "API key for authentication",
      true
    ),
  ]
);

// Add JSON schema for validation
export const leaveMeetingSchema = {
  type: "object",
  properties: {
    apiKey: { type: "string" },
  },
  required: ["apiKey"],
};

// Example of a tool execution function
export async function executeLeaveMeeting(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey
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
export const createCalendarTool: Tool = {
  name: 'createCalendar',
  description: 'Create a new calendar',
  parameters: {
    type: 'object',
    properties: {
      oauthCredentials: {
        type: 'object',
        description: 'OAuth credentials for calendar access',
        properties: {
          clientId: {
            type: 'string',
            description: 'OAuth client ID'
          },
          clientSecret: {
            type: 'string',
            description: 'OAuth client secret'
          },
          redirectUri: {
            type: 'string',
            description: 'OAuth redirect URI'
          }
        }
      },
      platform: {
        type: 'string',
        description: 'The calendar platform (e.g. google, microsoft)'
      },
      calendarName: {
        type: 'string',
        description: 'The name of the calendar to create'
      }
    },
    required: ['oauthCredentials', 'platform', 'calendarName']
  }
};

// Example of a tool execution function
export async function executeCreateCalendar(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey,
    });

    const result = await client.createCalendar({
      oauthClientId: args.oauthClientId,
      oauthClientSecret: args.oauthClientSecret,
      oauthRefreshToken: args.oauthRefreshToken,
      platform: args.platform as Provider,
      raw_calendar_id: args.rawCalendarId,
    });

    return `Calendar successfully integrated!\n\nDetails:\nName: ${result.calendar.name}\nEmail: ${result.calendar.email}\nUUID: ${result.calendar.uuid}`;
  } catch (error) {
    return `Error setting up calendar: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 4: Complex tool for scheduling recordings for calendar events
export const scheduleRecordEventTool: ToolDefinition = MpcTools.createTool(
  "schedule_record_event",
  "Schedule a bot to record a specific calendar event",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "eventUuid",
      "The UUID of the calendar event to record",
      true
    ),
    MpcTools.createStringParameter(
      "botName",
      "The display name of the bot in the meeting",
      true
    ),
    MpcTools.createStringParameter(
      "webhookUrl",
      "Optional URL to receive webhook notifications about the bot",
      false
    ),
    MpcTools.createStringParameter(
      "botImage",
      "Optional URL to an image for the bot avatar",
      false
    ),
    MpcTools.createEnumParameter(
      "recordingMode",
      ["speaker_view", "gallery_view", "audio_only"],
      "Which recording mode to use (defaults to speaker_view)",
      false
    ),
    MpcTools.createObjectParameter(
      "speechToText",
      {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
          description: "Which speech-to-text provider to use",
        },
        apiKey: {
          type: "string",
          description: "API key for the speech-to-text provider (if required)",
        },
      },
      "Speech-to-text configuration (optional)",
      false
    ),
    MpcTools.createBooleanParameter(
      "allOccurrences",
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
export const scheduleRecordEventSchema = {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    eventUuid: { type: "string" },
    botName: { type: "string" },
    webhookUrl: { type: "string" },
    botImage: { type: "string" },
    recordingMode: {
      type: "string",
      enum: ["speaker_view", "gallery_view", "audio_only"],
    },
    speechToText: {
      type: "object",
      properties: {
        provider: {
          type: "string",
          enum: ["Gladia", "Runpod", "Default"],
        },
        apiKey: { type: "string" },
      },
    },
    allOccurrences: { type: "boolean" },
    extra: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["apiKey", "eventUuid", "botName"],
};

// Example of a complex tool execution function with formatted response
export async function executeScheduleRecordEvent(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey,
    });

    // Prepare bot parameters for the API
    const botParams: BotParam2 = {
      botName: args.botName,
      webhook_url: args.webhookUrl || undefined,
      bot_image: args.botImage || undefined,
      recording_mode: (args.recordingMode as RecordingMode) || undefined,
      extra: args.extra || {},
    };

    // Add speech to text if provided
    if (args.speechToText) {
      botParams.speech_to_text = {
        provider: args.speechToText.provider as SpeechToTextProvider,
        api_key: args.speechToText.apiKey,
      };
    }

    // Call the SDK method - assuming the client has this method
    // This is an example for the AI model - the actual method name or parameters may differ
    const events = (await (client as any).scheduleRecordEvent(
      args.eventUuid,
      botParams,
      args.allOccurrences
    )) as Event[];

    // Format a user-friendly response
    if (!events || events.length === 0) {
      return "No events were scheduled for recording.";
    }

    if (events.length === 1) {
      const event = events[0];
      return `Successfully scheduled recording for event "${event.name}"
      
Event details:
- Start time: ${new Date(event.startTime).toLocaleString()}
- End time: ${new Date(event.endTime).toLocaleString()}
- Meeting URL: ${event.meetingUrl || "Not available"}
- Calendar: ${event.calendarUuid}
- Bot name: ${args.botName}

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
        event.startTime
      ).toLocaleString()}`
  )
  .join("\n")}

${events.length > 3 ? `...and ${events.length - 3} more occurrences.\n` : ""}
All recordings will use bot name: ${args.botName}`;
    }
  } catch (error) {
    return `Error scheduling event recording: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 5: API endpoint that returns complex data
export const getMeetingDataTool: ToolDefinition = MpcTools.createTool(
  "get-meeting-data",
  "Gets data for a specific meeting",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "API key for authentication",
      true
    ),
    MpcTools.createStringParameter(
      "botId",
      "ID of the bot to get data for",
      true
    )
  ]
);

// Add JSON schema for validation
export const getMeetingDataSchema = {
  type: "object",
  properties: {
    apiKey: { type: "string" },
    botId: { type: "string" },
  },
  required: ["apiKey", "botId"],
};

// Example of handling complex response data in a human-readable format
export async function executeGetMeetingData(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey,
    });

    const data = await client.getMeetingData(args.botId);

    if (!data) {
      return "No meeting data found for this bot ID.";
    }

    // Format the transcripts for better readability
    const transcriptSummary =
      data.botData.transcripts.length > 0
        ? data.botData.transcripts
            .map((transcript: Transcript, i: number) => {
              return `${i + 1}. ${transcript.speaker} (${formatTime(
                transcript.startTime
              )}): "${transcript.words.map((w: Word) => w.text).join(" ")}"`;
            })
            .join("\n\n")
            .substring(0, 1000) // Limit length
        : "No transcriptions available";

    // Add ellipsis if transcripts were truncated
    const transcriptEllipsis =
      data.botData.transcripts.length > 0 && transcriptSummary.length >= 1000
        ? "\n\n... (transcript truncated)"
        : "";

    return `Meeting Data for Bot ID: ${args.botId}

Recording URL: ${data.mp4 || "Not available"}
Duration: ${formatDuration(data.duration)}
Deleted: ${data.contentDeleted ? "Yes" : "No"}

Bot Details:
- Name: ${data.botData.bot.botName}
- Meeting URL: ${data.botData.bot.meetingUrl}
- Created: ${new Date(data.botData.bot.createdAt).toLocaleString()}
- Ended: ${
      data.botData.bot.endedAt
        ? new Date(data.botData.bot.endedAt).toLocaleString()
        : "Still active or information not available"
    }

Transcripts (${data.botData.transcripts.length} segments):
${transcriptSummary}${transcriptEllipsis}`;
  } catch (error) {
    return `Error retrieving meeting data: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}

// Example 6: Get meeting transcript with formatted output
export const getMeetingTranscriptTool: ToolDefinition = MpcTools.createTool(
  "get_meeting_transcript",
  "Get a meeting transcript with speaker names and content grouped by speaker",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "botId",
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
      apiKey: args.apiKey,
    });

    // Get meeting data from the API
    const response = await client.getMeetingData(args.botId);

    // Check for valid response structure
    if (!response || !response.botData) {
      return "Error: Invalid response structure from API.";
    }

    // Extract meeting information
    const meetingInfo = {
      name: response.botData.bot?.botName || "Unknown Meeting",
      url: response.botData.bot?.meetingUrl || "Unknown URL",
      duration: response.duration || 0,
    };

    // Extract transcripts from the response
    const transcripts = response.botData.transcripts || [];

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
export const searchMeetingTranscriptTool: ToolDefinition =
  MpcTools.createTool(
    "search_meeting_transcript",
    "Search through a meeting transcript for specific keywords or phrases",
    [
      MpcTools.createStringParameter(
        "apiKey",
        "Your Meeting BaaS API key",
        true
      ),
      MpcTools.createStringParameter(
        "botId",
        "The ID of the bot/meeting to search in",
        true
      ),
      MpcTools.createStringParameter(
        "query",
        "Keywords or phrase to search for in the transcript",
        true
      ),
      MpcTools.createBooleanParameter(
        "caseSensitive",
        "Whether the search should be case sensitive (defaults to false)",
        false
      ),
      MpcTools.createNumberParameter(
        "contextSeconds",
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
      apiKey: args.apiKey,
    });

    // Get meeting data from the API
    const response = await client.getMeetingData(args.botId);

    // Check if we have a valid meeting with transcripts
    if (!response || !response.botData || !response.botData.transcripts) {
      return "No transcript found for this meeting.";
    }

    const transcripts = response.botData.transcripts;
    if (transcripts.length === 0) {
      return "This meeting has no transcript segments to search through.";
    }

    // Prepare the search
    const query = args.caseSensitive ? args.query : args.query.toLowerCase();
    const contextSeconds = args.contextSeconds || 10;
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
      const textToSearch = args.caseSensitive
        ? segmentText
        : segmentText.toLowerCase();

      // Check if this segment contains the query
      if (textToSearch.includes(query)) {
        matches.push({
          timestamp: segment.startTime,
          speaker: segment.speaker,
          text: segmentText,
          // Include any other metadata that might be useful
          segment_start: segment.startTime,
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
    const meetingName = response.botData.bot?.botName || "Unknown Meeting";
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
export const listUpcomingMeetingsTool: ToolDefinition = MpcTools.createTool(
  "list_upcoming_meetings",
  "List upcoming meetings from a calendar",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "calendarId",
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
      apiKey: args.apiKey,
    });

    // Set default values
    const status = args.status || "upcoming";
    const limit = args.limit || 20;

    // Get events from the calendar
    // Note: This is a mock implementation - the actual client may not have this exact method
    // Use type assertion to avoid TypeScript errors in this example
    const response = await (client as any).listEvents(args.calendarId, {
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
          typeof meeting.startTime === "number"
            ? new Date(meeting.startTime).toLocaleString()
            : new Date(meeting.startTime as string).toLocaleString();
        const hasBot = meeting.botParam ? "🤖 Bot scheduled" : "";
        const meetingLink = meeting.meetingUrl
          ? `Link: ${meeting.meetingUrl}`
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
export const findKeyMomentsTool: ToolDefinition = MpcTools.createTool(
  "find_key_moments",
  "Automatically find and share key moments and topics from a meeting recording",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "botId",
      "ID of the bot that recorded the meeting",
      true
    ),
    MpcTools.createStringParameter(
      "meetingTitle",
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
      "maxMoments",
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
      apiKey: args.apiKey,
    });

    // Get the meeting data
    const response = await client.getMeetingData(args.botId);

    // Check if we have a valid response
    if (!response?.botData?.bot) {
      return `Could not find meeting data for the provided bot ID: ${args.botId}`;
    }

    const meetingTitle =
      args.meetingTitle ||
      response.botData.bot.botName ||
      "Meeting Recording";
    const transcripts = response.botData.transcripts || [];

    if (transcripts.length === 0) {
      return `No transcript found for meeting "${meetingTitle}". Cannot extract key moments without a transcript.`;
    }

    // Set default values
    const maxMoments = args.maxMoments || 5;
    const granularity = args.granularity || "medium";

    // Analyze transcripts to find key moments
    // This is simplified logic - in a real implementation,
    // we would use more sophisticated NLP techniques

    // Sort transcripts chronologically
    const sortedTranscripts = [...transcripts].sort(
      (a, b) => Number(a.startTime) - Number(b.startTime)
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
        timestamp: Number(firstTranscript.startTime),
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
          timestamp: Number(transcript.startTime),
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
        timestamp: Number(lastTranscript.startTime),
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
export const deleteMeetingDataTool: ToolDefinition = MpcTools.createTool(
  "delete_meeting_data",
  "Delete transcription, log files, and video recording, along with all data associated with a bot",
  [
    MpcTools.createStringParameter(
      "apiKey",
      "Your Meeting BaaS API key",
      true
    ),
    MpcTools.createStringParameter(
      "botId",
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
      apiKey: args.apiKey,
    });

    // Call the delete endpoint - this is a mock implementation
    // Use type assertion to avoid TypeScript errors in this example
    const response = await (client as any).deleteData(args.botId);

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
export const listCalendarsTool: ToolDefinition = MpcTools.createTool(
  "list_calendars",
  "List all calendars integrated with Meeting BaaS",
  [MpcTools.createStringParameter("apiKey", "Your Meeting BaaS API key", true)]
);

// Example of listing calendars
export async function executeListCalendars(
  args: any,
  context: any
): Promise<string> {
  try {
    // Create a client with the user's API key
    const client = new BaasClient({
      apiKey: args.apiKey,
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
