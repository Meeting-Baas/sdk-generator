import { BaasClient as GeneratedBaasClient, BaasClientConfig } from '../generated/baas/api/client';
import { JoinRequest, JoinResponse, LeaveResponse, CreateCalendarParams, CreateCalendarResponse, Metadata } from '../generated/baas/models';

/**
 * Enhanced client for the Meeting BaaS API
 * This class extends the generated client with more user-friendly methods
 */
export class BaasClient extends GeneratedBaasClient {
  constructor(config: BaasClientConfig) {
    super(config);
  }

  /**
   * Join a meeting with a bot
   * @param params The join request parameters
   * @returns The bot ID
   */
  async joinMeeting(params: JoinRequest): Promise<string> {
    const response = await this.defaultApi.join({ joinRequest: params });
    return response.data.botId;
  }

  /**
   * Leave the current meeting
   * @returns Whether the bot successfully left the meeting
   */
  async leaveMeeting(): Promise<boolean> {
    const response = await this.defaultApi.leave();
    return response.data.ok;
  }

  /**
   * Create a new calendar
   * @param params The calendar creation parameters
   * @returns The created calendar
   */
  async createCalendar(params: CreateCalendarParams): Promise<CreateCalendarResponse> {
    const response = await this.calendarsApi.createCalendar({ createCalendarParams: params });
    return response.data;
  }

  /**
   * Get meeting data for a bot
   * @param botId The bot ID
   * @returns The meeting metadata
   */
  async getMeetingData(botId: string): Promise<Metadata> {
    const response = await this.defaultApi.getMeetingData({ botId });
    return response.data;
  }
} 