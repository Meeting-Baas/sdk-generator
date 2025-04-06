// BaaS Client Wrapper
import {
  CalendarsApi,
  Configuration,
  DefaultApi,
  WebhooksApi,
} from "../generated/baas";
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
  private botsApi: DefaultApi;
  private calendarsApi: CalendarsApi;
  private webhooksApi: WebhooksApi;
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

    this.botsApi = new DefaultApi(this.config);
    this.calendarsApi = new CalendarsApi(this.config);
    this.webhooksApi = new WebhooksApi(this.config);
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
      start_time: options.startTime,
      extra: options.extra,
    };

    const response = await this.botsApi.join(request);
    return response.data.bot_id;
  }

  /**
   * Have a bot leave a meeting
   * @param botId The ID of the bot to leave
   * @returns Boolean indicating success
   */
  async leaveMeeting(botId: string): Promise<boolean> {
    const response = await this.botsApi.leave(botId);
    return response.data.ok;
  }

  /**
   * Get meeting data for a bot
   * @param botId The ID of the bot to get data for
   * @returns Meeting metadata
   */
  async getMeetingData(botId: string): Promise<any> {
    const response = await this.botsApi.getMeetingData(botId);
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
    const response = await this.botsApi.deleteData(botId);
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
    const response = await this.calendarsApi.resyncAll();
    return response.data;
  }

  /**
   * List events from a calendar
   * @param calendarId Calendar UUID
   * @param options Optional filtering options
   * @returns Array of calendar events
   */
  async listEvents(
    calendarId: string,
    options?: {
      attendeeEmail?: string;
      cursor?: string;
      organizerEmail?: string;
      startDateGte?: string;
      startDateLte?: string;
      status?: string;
      updatedAtGte?: string;
    }
  ): Promise<any> {
    const response = await this.calendarsApi.listEvents(
      calendarId,
      options?.attendeeEmail || null,
      options?.cursor || null,
      options?.organizerEmail || null,
      options?.startDateGte || null,
      options?.startDateLte || null,
      options?.status || null,
      options?.updatedAtGte || null
    );
    return response.data;
  }

  /**
   * Get a specific calendar event
   * @param uuid Event UUID
   * @returns Event data
   */
  async getEvent(uuid: string): Promise<any> {
    const response = await this.calendarsApi.getEvent(uuid);
    return response.data;
  }

  /**
   * Schedule a recording for a calendar event
   * @param uuid Event UUID
   * @param options Recording configuration
   * @param allOccurrences Whether to schedule all occurrences
   * @returns Updated event data
   */
  async scheduleRecordEvent(
    uuid: string,
    options: {
      botName: string;
      extra?: Record<string, any>;
      botImage?: string;
      webhookUrl?: string;
      deduplicationKey?: string;
      entryMessage?: string;
      recordingMode?: RecordingMode;
      speechToText?: SpeechToText;
    },
    allOccurrences?: boolean
  ): Promise<any> {
    const request = {
      bot_name: options.botName,
      extra: options.extra || {},
      bot_image: options.botImage,
      webhook_url: options.webhookUrl,
      deduplication_key: options.deduplicationKey,
      enter_message: options.entryMessage,
      recording_mode: options.recordingMode,
      speech_to_text: options.speechToText,
    };

    const response = await this.calendarsApi.scheduleRecordEvent(
      uuid,
      request,
      allOccurrences || null
    );
    return response.data;
  }

  /**
   * Unschedule a recording for a calendar event
   * @param uuid Event UUID
   * @param allOccurrences Whether to unschedule all occurrences
   * @returns Updated event data
   */
  async unscheduleRecordEvent(
    uuid: string,
    allOccurrences?: boolean
  ): Promise<any> {
    const response = await this.calendarsApi.unscheduleRecordEvent(
      uuid,
      allOccurrences || null
    );
    return response.data;
  }

  /**
   * Update a calendar integration
   * @param uuid Calendar UUID
   * @param options Update options
   * @returns Updated calendar data
   */
  async updateCalendar(
    uuid: string,
    options: {
      oauthClientId?: string;
      oauthClientSecret?: string;
      oauthRefreshToken?: string;
      platform?: Provider;
      rawCalendarId?: string;
    }
  ): Promise<any> {
    const request: any = {};

    if (options.oauthClientId) request.oauth_client_id = options.oauthClientId;
    if (options.oauthClientSecret)
      request.oauth_client_secret = options.oauthClientSecret;
    if (options.oauthRefreshToken)
      request.oauth_refresh_token = options.oauthRefreshToken;
    if (options.platform) request.platform = options.platform;
    if (options.rawCalendarId) request.raw_calendar_id = options.rawCalendarId;

    const response = await this.calendarsApi.updateCalendar(uuid, request);
    return response.data;
  }

  /**
   * List raw calendars from a provider
   * @param options Provider credentials
   * @returns List of raw calendars
   */
  async listRawCalendars(options: {
    oauthClientId: string;
    oauthClientSecret: string;
    oauthRefreshToken: string;
    platform: Provider;
  }): Promise<any> {
    const request = {
      oauth_client_id: options.oauthClientId,
      oauth_client_secret: options.oauthClientSecret,
      oauth_refresh_token: options.oauthRefreshToken,
      platform: options.platform,
    };

    const response = await this.calendarsApi.listRawCalendars(request);
    return response.data;
  }

  /**
   * Update a bot configuration for a calendar event
   * @param uuid Event UUID
   * @param options Bot configuration updates
   * @param allOccurrences Whether to update all occurrences
   * @returns Updated event data
   */
  async patchBot(
    uuid: string,
    options: {
      botName?: string;
      botImage?: string;
      extra?: Record<string, any>;
      webhookUrl?: string;
      deduplicationKey?: string;
      entryMessage?: string;
      recordingMode?: RecordingMode;
      speechToText?: SpeechToText;
    },
    allOccurrences?: boolean
  ): Promise<any> {
    const request: any = {};

    if (options.botName) request.bot_name = options.botName;
    if (options.botImage) request.bot_image = options.botImage;
    if (options.extra) request.extra = options.extra;
    if (options.webhookUrl) request.webhook_url = options.webhookUrl;
    if (options.deduplicationKey)
      request.deduplication_key = options.deduplicationKey;
    if (options.entryMessage) request.enter_message = options.entryMessage;
    if (options.recordingMode) request.recording_mode = options.recordingMode;
    if (options.speechToText) request.speech_to_text = options.speechToText;

    const response = await this.calendarsApi.patchBot(
      uuid,
      request,
      allOccurrences || null
    );
    return response.data;
  }

  /**
   * Get webhook documentation
   * @returns Webhook documentation
   */
  async getWebhookDocumentation(): Promise<any> {
    const response = await this.webhooksApi.webhookDocumentation();
    return response.data;
  }

  /**
   * Get bot webhook documentation
   * @returns Bot webhook documentation
   */
  async getBotWebhookDocumentation(): Promise<any> {
    const response = await this.webhooksApi.botWebhookDocumentation();
    return response.data;
  }

  /**
   * Get calendar webhook documentation
   * @returns Calendar webhook documentation
   */
  async getCalendarWebhookDocumentation(): Promise<any> {
    const response = await this.webhooksApi.calendarWebhookDocumentation();
    return response.data;
  }

  /**
   * List recent bots with metadata
   * @param options Optional filtering options
   * @returns Array of bots with metadata
   */
  async listRecentBots(options?: {
    botName?: string;
    createdAfter?: string;
    createdBefore?: string;
    cursor?: string;
    filterByExtra?: string;
    limit?: number;
    meetingUrl?: string;
    sortByExtra?: string;
    speakerName?: string;
  }): Promise<any> {
    const response = await this.botsApi.listRecentBots(
      options?.botName || null,
      options?.createdAfter || null,
      options?.createdBefore || null,
      options?.cursor || null,
      options?.filterByExtra || null,
      options?.limit,
      options?.meetingUrl || null,
      options?.sortByExtra || null,
      options?.speakerName || null
    );
    return response.data;
  }

  /**
   * Get bots with metadata
   * @param options Optional filtering options
   * @returns Array of bots with metadata
   */
  async botsWithMetadata(options?: {
    botName?: string;
    createdAfter?: string;
    createdBefore?: string;
    cursor?: string;
    filterByExtra?: string;
    limit?: number;
    meetingUrl?: string;
    sortByExtra?: string;
    speakerName?: string;
  }): Promise<any> {
    const response = await this.botsApi.botsWithMetadata(
      options?.botName || null,
      options?.createdAfter || null,
      options?.createdBefore || null,
      options?.cursor || null,
      options?.filterByExtra || null,
      options?.limit,
      options?.meetingUrl || null,
      options?.sortByExtra || null,
      options?.speakerName || null
    );
    return response.data;
  }

  /**
   * Retranscribe a bot's audio
   * @param options Retranscription options
   */
  async retranscribeBot(options: {
    botId: string;
    provider?: SpeechToText;
  }): Promise<void> {
    await this.botsApi.retranscribeBot({
      bot_uuid: options.botId,
      speech_to_text: options.provider || null,
    });
  }
}
