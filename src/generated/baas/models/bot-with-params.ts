/* tslint:disable */
/* eslint-disable */
/**
 * Meeting BaaS API
 * Meeting BaaS API
 *
 * The version of the OpenAPI document: 1.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import type { AudioFrequency } from './audio-frequency';
// May contain unused imports in some cases
// @ts-ignore
import type { RecordingMode } from './recording-mode';
// May contain unused imports in some cases
// @ts-ignore
import type { SpeechToTextProvider } from './speech-to-text-provider';

/**
 * 
 * @export
 * @interface BotWithParams
 */
export interface BotWithParams {
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'accountId': number;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'bot_image'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'botName': string;
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'botParamId': number;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'createdAt': string;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'deduplication_key'?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof BotWithParams
     */
    'diarization_v2': boolean;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'endedAt': string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'enter_message'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'errors'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'event_id'?: number | null;
    /**
     * Custom data object
     * @type {{ [key: string]: any | undefined; }}
     * @memberof BotWithParams
     */
    'extra': { [key: string]: any | undefined; };
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'id': number;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'meetingUrl': string;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'mp4_s3_path': string;
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'noone_joined_timeout'?: number | null;
    /**
     * 
     * @type {RecordingMode}
     * @memberof BotWithParams
     */
    'recording_mode'?: RecordingMode | null;
    /**
     * 
     * @type {boolean}
     * @memberof BotWithParams
     */
    'reserved': boolean;
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'scheduled_bot_id'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'session_id'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'speech_to_text_api_key'?: string | null;
    /**
     * 
     * @type {SpeechToTextProvider}
     * @memberof BotWithParams
     */
    'speech_to_text_provider'?: SpeechToTextProvider | null;
    /**
     * 
     * @type {AudioFrequency}
     * @memberof BotWithParams
     */
    'streaming_audio_frequency'?: AudioFrequency | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'streaming_input'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'streaming_output'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'uuid': string;
    /**
     * 
     * @type {number}
     * @memberof BotWithParams
     */
    'waiting_room_timeout'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'webhookUrl': string;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'zoom_sdk_id'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof BotWithParams
     */
    'zoom_sdk_pwd'?: string | null;
}



