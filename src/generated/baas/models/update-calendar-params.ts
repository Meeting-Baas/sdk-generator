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
import type { Provider } from './provider';

/**
 * 
 * @export
 * @interface UpdateCalendarParams
 */
export interface UpdateCalendarParams {
    /**
     * 
     * @type {string}
     * @memberof UpdateCalendarParams
     */
    'oauthClientId': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCalendarParams
     */
    'oauthClientSecret': string;
    /**
     * 
     * @type {string}
     * @memberof UpdateCalendarParams
     */
    'oauthRefreshToken': string;
    /**
     * 
     * @type {Provider}
     * @memberof UpdateCalendarParams
     */
    'platform': Provider;
}



