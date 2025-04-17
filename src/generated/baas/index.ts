import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateCalendarParams,
  JoinRequest,
  Provider,
  SpeechToTextProvider,
} from './models';

export class Configuration {
  constructor(public config: {
    apiKey: string;
    basePath?: string;
  }) {}
}

export class DefaultApi {
  private axiosInstance: AxiosInstance;

  constructor(private configuration: Configuration) {
    this.axiosInstance = axios.create({
      baseURL: this.configuration.config.basePath || 'https://api.meetingbaas.com',
      headers: {
        'Authorization': `Bearer ${this.configuration.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async join(request: JoinRequest): Promise<AxiosResponse<{ bot_id: string }>> {
    return this.axiosInstance.post('/v1/bots/join', request);
  }

  async leave(botId: string): Promise<AxiosResponse<{ ok: boolean }>> {
    return this.axiosInstance.post(`/v1/bots/${botId}/leave`);
  }

  async getMeetingData(botId: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/v1/bots/${botId}/data`);
  }

  async deleteData(botId: string): Promise<AxiosResponse<{ ok: boolean; status: string }>> {
    return this.axiosInstance.delete(`/v1/bots/${botId}/data`);
  }

  async listRecentBots(
    botName?: string | null,
    createdAfter?: string | null,
    createdBefore?: string | null,
    cursor?: string | null,
    filterByExtra?: string | null,
    limit?: number,
    meetingUrl?: string | null,
    sortByExtra?: string | null,
    speakerName?: string | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (botName) params.bot_name = botName;
    if (createdAfter) params.created_after = createdAfter;
    if (createdBefore) params.created_before = createdBefore;
    if (cursor) params.cursor = cursor;
    if (filterByExtra) params.filter_by_extra = filterByExtra;
    if (limit) params.limit = limit;
    if (meetingUrl) params.meeting_url = meetingUrl;
    if (sortByExtra) params.sort_by_extra = sortByExtra;
    if (speakerName) params.speaker_name = speakerName;

    return this.axiosInstance.get('/v1/bots/recent', { params });
  }

  async botsWithMetadata(
    botName?: string | null,
    createdAfter?: string | null,
    createdBefore?: string | null,
    cursor?: string | null,
    filterByExtra?: string | null,
    limit?: number,
    meetingUrl?: string | null,
    sortByExtra?: string | null,
    speakerName?: string | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (botName) params.bot_name = botName;
    if (createdAfter) params.created_after = createdAfter;
    if (createdBefore) params.created_before = createdBefore;
    if (cursor) params.cursor = cursor;
    if (filterByExtra) params.filter_by_extra = filterByExtra;
    if (limit) params.limit = limit;
    if (meetingUrl) params.meeting_url = meetingUrl;
    if (sortByExtra) params.sort_by_extra = sortByExtra;
    if (speakerName) params.speaker_name = speakerName;

    return this.axiosInstance.get('/v1/bots', { params });
  }

  async retranscribeBot(request: { bot_uuid: string; speech_to_text: SpeechToTextProvider | null }): Promise<AxiosResponse<void>> {
    return this.axiosInstance.post(`/v1/bots/${request.bot_uuid}/retranscribe`, {
      speech_to_text: request.speech_to_text
    });
  }
}

export class CalendarsApi {
  private axiosInstance: AxiosInstance;

  constructor(private configuration: Configuration) {
    this.axiosInstance = axios.create({
      baseURL: this.configuration.config.basePath || 'https://api.meetingbaas.com',
      headers: {
        'Authorization': `Bearer ${this.configuration.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createCalendar(request: CreateCalendarParams): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post('/v1/calendars', request);
  }

  async listCalendars(): Promise<AxiosResponse<any[]>> {
    return this.axiosInstance.get('/v1/calendars');
  }

  async getCalendar(uuid: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/v1/calendars/${uuid}`);
  }

  async deleteCalendar(uuid: string): Promise<AxiosResponse<void>> {
    return this.axiosInstance.delete(`/v1/calendars/${uuid}`);
  }

  async resyncAll(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post('/v1/calendars/resync');
  }

  async listEvents(
    calendarId: string,
    attendeeEmail?: string | null,
    cursor?: string | null,
    organizerEmail?: string | null,
    startDateGte?: string | null,
    startDateLte?: string | null,
    status?: string | null,
    updatedAtGte?: string | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (attendeeEmail) params.attendee_email = attendeeEmail;
    if (cursor) params.cursor = cursor;
    if (organizerEmail) params.organizer_email = organizerEmail;
    if (startDateGte) params.start_date_gte = startDateGte;
    if (startDateLte) params.start_date_lte = startDateLte;
    if (status) params.status = status;
    if (updatedAtGte) params.updated_at_gte = updatedAtGte;

    return this.axiosInstance.get(`/v1/calendars/${calendarId}/events`, { params });
  }

  async getEvent(uuid: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(`/v1/events/${uuid}`);
  }

  async scheduleRecordEvent(
    uuid: string,
    request: any,
    allOccurrences?: boolean | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (allOccurrences) params.all_occurrences = allOccurrences;

    return this.axiosInstance.post(`/v1/events/${uuid}/schedule`, request, { params });
  }

  async unscheduleRecordEvent(
    uuid: string,
    allOccurrences?: boolean | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (allOccurrences) params.all_occurrences = allOccurrences;

    return this.axiosInstance.post(`/v1/events/${uuid}/unschedule`, {}, { params });
  }

  async updateCalendar(
    uuid: string,
    request: any
  ): Promise<AxiosResponse<any>> {
    return this.axiosInstance.patch(`/v1/calendars/${uuid}`, request);
  }

  async listRawCalendars(request: {
    oauth_client_id: string;
    oauth_client_secret: string;
    oauth_refresh_token: string;
    platform: Provider;
  }): Promise<AxiosResponse<any>> {
    return this.axiosInstance.post('/v1/calendars/raw', request);
  }

  async patchBot(
    uuid: string,
    request: any,
    allOccurrences?: boolean | null
  ): Promise<AxiosResponse<any>> {
    const params: Record<string, any> = {};
    if (allOccurrences) params.all_occurrences = allOccurrences;

    return this.axiosInstance.patch(`/v1/events/${uuid}/bot`, request, { params });
  }
}

export class WebhooksApi {
  private axiosInstance: AxiosInstance;

  constructor(private configuration: Configuration) {
    this.axiosInstance = axios.create({
      baseURL: this.configuration.config.basePath || 'https://api.meetingbaas.com',
      headers: {
        'Authorization': `Bearer ${this.configuration.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async webhookDocumentation(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get('/v1/webhooks/docs');
  }

  async botWebhookDocumentation(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get('/v1/webhooks/bot/docs');
  }

  async calendarWebhookDocumentation(): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get('/v1/webhooks/calendar/docs');
  }
}