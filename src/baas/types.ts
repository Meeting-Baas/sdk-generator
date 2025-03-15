// Type definitions for BaaS API
import { z } from "zod";

// Common API Response Structure
export interface ApiResponse<T> {
  data: T;
}

// Bot Types
export const RecordingModeEnum = z.enum([
  "speaker_view",
  "gallery_view",
  "audio_only",
]);
export type RecordingMode = z.infer<typeof RecordingModeEnum>;

export const SpeechToTextProviderEnum = z.enum(["Gladia", "Runpod", "Default"]);
export type SpeechToTextProvider = z.infer<typeof SpeechToTextProviderEnum>;

export const AudioFrequencyEnum = z.enum(["16khz", "24khz"]);
export type AudioFrequency = z.infer<typeof AudioFrequencyEnum>;

// Bot Parameters
export interface SpeechToTextOptions {
  provider: SpeechToTextProvider;
  api_key?: string;
}

export interface StreamingOptions {
  input?: string;
  output?: string;
  audio_frequency?: AudioFrequency;
}

export interface BotParams {
  bot_name: string;
  bot_image?: string;
  meeting_url: string;
  reserved: boolean;
  webhook_url?: string;
  deduplication_key?: string;
  enter_message?: string;
  recording_mode?: RecordingMode;
  speech_to_text?: SpeechToTextOptions;
  streaming?: StreamingOptions;
  noone_joined_timeout?: number;
  waiting_room_timeout?: number;
  extra?: Record<string, any>;
  start_time?: number;
}

// Calendar Types
export const ProviderEnum = z.enum(["Google", "Microsoft"]);
export type Provider = z.infer<typeof ProviderEnum>;

export interface CalendarParams {
  oauth_client_id: string;
  oauth_client_secret: string;
  oauth_refresh_token: string;
  platform: Provider;
  raw_calendar_id?: string;
}

// Response Types
export interface JoinResponse {
  bot_id: string;
}

export interface LeaveResponse {
  ok: boolean;
}

export interface BotData {
  bot_id: string;
  // Additional fields will be properly defined based on API responses
}

export interface CalendarData {
  calendar_uuid: string;
  // Additional fields will be properly defined based on API responses
}

// Add more types as needed based on the API...
