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
 * @interface ListRawCalendarsParams
 */
export interface ListRawCalendarsParams {
    /**
     * 
     * @type {string}
     * @memberof ListRawCalendarsParams
     */
    'oauthClientId': string;
    /**
     * 
     * @type {string}
     * @memberof ListRawCalendarsParams
     */
    'oauthClientSecret': string;
    /**
     * 
     * @type {string}
     * @memberof ListRawCalendarsParams
     */
    'oauthRefreshToken': string;
    /**
     * 
     * @type {Provider}
     * @memberof ListRawCalendarsParams
     */
    'platform': Provider;
}



