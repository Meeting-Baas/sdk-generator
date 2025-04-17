export type Provider =
  | "google"
  | "microsoft"
  | "zoom"
  | "webex"
  | "gotomeeting"
  | "other";

export type RecordingMode = "speaker_view" | "gallery_view" | "audio_only";

export enum SpeechToTextProvider {
  gladia = "gladia",
  assemblyai = "assemblyai",
  deepgram = "deepgram",
  revai = "revai",
  google = "google",
  azure = "azure",
  aws = "aws",
  default = "gladia",
}

export enum AudioFrequency {
  Narrowband = "narrowband",
  Wideband = "wideband",
  SuperWideband = "superwideband",
  Fullband = "fullband",
}

export interface JoinRequest {
  bot_name: string;
  meeting_url: string;
  reserved: boolean;
  webhook_url?: string;
  bot_image?: string;
  deduplication_key?: string;
  entry_message?: string;
  recording_mode?: RecordingMode;
  speech_to_text?: SpeechToTextProvider;
  start_time?: number;
  extra?: Record<string, any>;
}

export interface CreateCalendarParams {
  oauth_client_id: string;
  oauth_client_secret: string;
  oauth_refresh_token: string;
  platform: Provider;
  raw_calendar_id?: string;
}

export interface Calendar {
  id: string;
  platform: Provider;
  raw_calendar_id: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  calendar_id: string;
  raw_event_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  organizer_email: string;
  meeting_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  bot_config?: {
    bot_name?: string;
    bot_image?: string;
    webhook_url?: string;
    deduplication_key?: string;
    entry_message?: string;
    recording_mode?: RecordingMode;
    speech_to_text?: SpeechToTextProvider;
    extra?: Record<string, any>;
  };
}

export interface Bot {
  id: string;
  bot_name: string;
  meeting_url: string;
  reserved: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  webhook_url?: string;
  bot_image?: string;
  deduplication_key?: string;
  entry_message?: string;
  recording_mode?: RecordingMode;
  speech_to_text?: SpeechToTextProvider;
  extra?: Record<string, any>;
}

export interface WebhookDocumentation {
  events: {
    name: string;
    description: string;
    payload: Record<string, any>;
  }[];
}

export interface BotWebhookDocumentation extends WebhookDocumentation {
  bot_specific_events: {
    name: string;
    description: string;
    payload: Record<string, any>;
  }[];
}

export interface CalendarWebhookDocumentation extends WebhookDocumentation {
  calendar_specific_events: {
    name: string;
    description: string;
    payload: Record<string, any>;
  }[];
}
