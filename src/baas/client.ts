// BaaS Client Wrapper
import { CalendarsApi, Configuration, DefaultApi } from "../generated/baas";
import {
  CreateCalendarParams,
  JoinRequest,
  Provider,
  RecordingMode,
  SpeechToText,
} from "../generated/baas/models";

/**
 * BaaS Client configuration options
 */
export interface BaasClientConfig {
  /**
   * API key for authenticating with the BaaS API
   */
  apiKey: string;
  /**
   * Optional base URL for the BaaS API
   * @default 'https://api.meetingbaas.com'
   */
  baseUrl?: string;
}

/**
 * A wrapper around the generated BaaS API client to provide a more user-friendly interface
 */
export class BaasClient {
  private defaultApi: DefaultApi;
  private calendarsApi: CalendarsApi;
  private config: Configuration;

  /**
   * Creates a new BaaS API client
   * @param config Client configuration options
   */
  constructor(config: BaasClientConfig) {
    this.config = new Configuration({
      apiKey: config.apiKey,
      basePath: config.baseUrl || "https://api.meetingbaas.com",
    });

    this.defaultApi = new DefaultApi(this.config);
    this.calendarsApi = new CalendarsApi(this.config);
  }

  /**
   * Have a bot join a meeting
   * @param options Bot configuration options
   * @returns Bot ID on success
   */
  async joinMeeting(options: {
    botName: string;
    meetingUrl: string;
    reserved: boolean;
    webhookUrl?: string;
    botImage?: string;
    deduplicationKey?: string;
    entryMessage?: string;
    recordingMode?: RecordingMode;
    speechToText?: SpeechToText;
    startTime?: number;
    extra?: Record<string, any>;
  }): Promise<string> {
    const request: JoinRequest = {
      bot_name: options.botName,
      meeting_url: options.meetingUrl,
      reserved: options.reserved,
      webhook_url: options.webhookUrl,
      bot_image: options.botImage,
      deduplication_key: options.deduplicationKey,
      entry_message: options.entryMessage,
      recording_mode: options.recordingMode,
      speech_to_text: options.speechToText,
      extra: options.extra,
    };

    const response = await this.defaultApi.join(request);
    return response.data.bot_id;
  }

  /**
   * Have a bot leave a meeting
   * @param botId The ID of the bot to leave
   * @returns Boolean indicating success
   */
  async leaveMeeting(botId: string): Promise<boolean> {
    const response = await this.defaultApi.leave(botId);
    return response.data.ok;
  }

  /**
   * Get meeting data for a bot
   * @param botId The ID of the bot to get data for
   * @returns Meeting metadata
   */
  async getMeetingData(botId: string): Promise<any> {
    const response = await this.defaultApi.getMeetingData(botId);
    return response.data;
  }

  /**
   * Delete a bot's data
   * @param botId The ID of the bot to delete data for
   * @returns Status of the deletion
   */
  async deleteData(botId: string): Promise<{
    ok: boolean;
    status: string;
  }> {
    const response = await this.defaultApi.deleteData(botId);
    return response.data;
  }

  /**
   * Create a calendar integration
   * @param options Calendar integration options
   * @returns Created calendar data
   */
  async createCalendar(options: {
    oauthClientId: string;
    oauthClientSecret: string;
    oauthRefreshToken: string;
    platform: Provider;
    rawCalendarId?: string;
  }): Promise<any> {
    const request: CreateCalendarParams = {
      oauth_client_id: options.oauthClientId,
      oauth_client_secret: options.oauthClientSecret,
      oauth_refresh_token: options.oauthRefreshToken,
      platform: options.platform,
      raw_calendar_id: options.rawCalendarId,
    };

    const response = await this.calendarsApi.createCalendar(request);
    return response.data;
  }

  /**
   * List all calendars
   * @returns Array of calendars
   */
  async listCalendars(): Promise<any[]> {
    const response = await this.calendarsApi.listCalendars();
    return response.data;
  }

  /**
   * Get a specific calendar
   * @param uuid Calendar UUID
   * @returns Calendar data
   */
  async getCalendar(uuid: string): Promise<any> {
    const response = await this.calendarsApi.getCalendar(uuid);
    return response.data;
  }

  /**
   * Delete a calendar
   * @param uuid Calendar UUID
   * @returns Success status
   */
  async deleteCalendar(uuid: string): Promise<boolean> {
    await this.calendarsApi.deleteCalendar(uuid);
    return true;
  }

  /**
   * Resync all calendars
   * @returns Resync result
   */
  async resyncAllCalendars(): Promise<any> {
    const response = await this.calendarsApi.resyncAllCalendars();
    return response.data;
  }
}
