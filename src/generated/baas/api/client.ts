import { Configuration } from '../configuration';
import { CalendarsApi } from './calendars-api';
import { DefaultApi } from './default-api';

export interface BaasClientConfig {
  apiKey: string;
  baseUrl?: string;
}

/**
 * Main client for the Meeting BaaS API
 * This class combines all API endpoints into a single client
 */
export class BaasClient {
  private configuration: Configuration;
  private _calendarsApi: CalendarsApi;
  private _defaultApi: DefaultApi;

  constructor(config: BaasClientConfig) {
    this.configuration = new Configuration({
      apiKey: config.apiKey,
      basePath: config.baseUrl,
    });
    this._calendarsApi = new CalendarsApi(this.configuration);
    this._defaultApi = new DefaultApi(this.configuration);
  }

  /**
   * Get the CalendarsApi instance
   */
  get calendarsApi() {
    return this._calendarsApi;
  }

  /**
   * Get the DefaultApi instance
   */
  get defaultApi() {
    return this._defaultApi;
  }
}
