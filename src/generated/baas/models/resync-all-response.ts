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



/**
 * 
 * @export
 * @interface ResyncAllResponse
 */
export interface ResyncAllResponse {
    /**
     * List of calendar UUIDs that failed to resync, with error messages
     * @type {Array<Array<any>>}
     * @memberof ResyncAllResponse
     */
    'errors': Array<Array<any>>;
    /**
     * List of calendar UUIDs that were successfully resynced
     * @type {Array<string>}
     * @memberof ResyncAllResponse
     */
    'syncedCalendars': Array<string>;
}

