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
import type { ScheduleOrigin } from './schedule-origin';

/**
 * 
 * @export
 * @interface JoinRequestScheduled
 */
export interface JoinRequestScheduled {
    [key: string]: any;

    /**
     * 
     * @type {number}
     * @memberof JoinRequestScheduled
     */
    'botParamId': number;
    /**
     * 
     * @type {string}
     * @memberof JoinRequestScheduled
     */
    'meetingUrl': string;
    /**
     * 
     * @type {ScheduleOrigin}
     * @memberof JoinRequestScheduled
     */
    'scheduleOrigin': ScheduleOrigin;
}

