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
import type { Bot } from './bot';

/**
 * 
 * @export
 * @interface BotPagined
 */
export interface BotPagined {
    /**
     * 
     * @type {Array<Bot>}
     * @memberof BotPagined
     */
    'bots': Array<Bot>;
    /**
     * 
     * @type {boolean}
     * @memberof BotPagined
     */
    'hasMore': boolean;
}

