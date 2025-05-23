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
import type { BotData } from './bot-data';

/**
 * 
 * @export
 * @interface Metadata
 */
export interface Metadata {
    /**
     * 
     * @type {BotData}
     * @memberof Metadata
     */
    'botData': BotData;
    /**
     * Duration of the recording in seconds
     * @type {number}
     * @memberof Metadata
     */
    'duration': number;
    /**
     * URL to access the recording MP4 file. Will be an empty string if the file doesn\'t exist in S3.
     * @type {string}
     * @memberof Metadata
     */
    'mp4': string;
}

