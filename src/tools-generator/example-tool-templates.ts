/**
 * Example MPC Tool Templates
 *
 * These templates are used by the tools generator to understand the structure
 * and patterns of MPC tools. The code generation LLM will use these as a reference.
 */

import { BaasClient } from "../baas/client";
import {
  Provider,
  RecordingMode,
  SpeechToText,
} from "../generated/baas/models";
import * as MpcTools from "../mpc/tools";
import { ToolDefinition } from "../mpc/types";

// Example 1: Simple tool with a single parameter
export const join_meeting_tool: ToolDefinition = MpcTools.createTool(
  "join_meeting",
  "Have a bot join a meeting and start recording",
  [
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

// Example of a tool execution function
export async function executeJoinMeeting(
  args: any,
  context: any,
  baasClient: BaasClient
): Promise<string> {
  try {
    // Convert from snake_case tool parameters to camelCase SDK parameters
    const result = await baasClient.joinMeeting({
      botName: args.bot_name,
      meetingUrl: args.meeting_url,
      reserved: args.reserved,
      webhookUrl: args.webhook_url,
      botImage: args.bot_image,
      entryMessage: args.entry_message,
      recordingMode: args.recording_mode as RecordingMode,
      speechToText: args.speech_to_text as SpeechToText,
      startTime: args.start_time,
      extra: args.extra,
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
      "bot_id",
      "The ID of the bot to remove from the meeting",
      true
    ),
  ]
);

// Example of a tool execution function
export async function executeLeaveMeeting(
  args: any,
  context: any,
  baasClient: BaasClient
): Promise<string> {
  try {
    const result = await baasClient.leaveMeeting(args.bot_id);

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
  context: any,
  baasClient: BaasClient
): Promise<string> {
  try {
    const result = await baasClient.createCalendar({
      oauthClientId: args.oauth_client_id,
      oauthClientSecret: args.oauth_client_secret,
      oauthRefreshToken: args.oauth_refresh_token,
      platform: args.platform as Provider,
      rawCalendarId: args.raw_calendar_id,
    });

    return `Calendar successfully integrated!\n\nDetails:\nName: ${result.calendar.name}\nEmail: ${result.calendar.email}\nUUID: ${result.calendar.uuid}`;
  } catch (error) {
    return `Error setting up calendar: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
}
