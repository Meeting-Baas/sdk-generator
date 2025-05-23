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
import type { Attendee } from './attendee';
// May contain unused imports in some cases
// @ts-ignore
import type { BotParam } from './bot-param';

/**
 * 
 * @export
 * @interface Event
 */
export interface Event {
    /**
     * 
     * @type {Array<Attendee>}
     * @memberof Event
     */
    'attendees': Array<Attendee>;
    /**
     * 
     * @type {BotParam}
     * @memberof Event
     */
    'bot_param'?: BotParam | null;
    /**
     * 
     * @type {string}
     * @memberof Event
     */
    'calendarUuid': string;
    /**
     * Indicates whether this event has been deleted
     * @type {boolean}
     * @memberof Event
     */
    'deleted': boolean;
    /**
     * The end time of the event in UTC timezone
     * @type {string}
     * @memberof Event
     */
    'endTime': string;
    /**
     * The unique identifier of the event from the calendar provider (Google, Microsoft)
     * @type {string}
     * @memberof Event
     */
    'googleId': string;
    /**
     * Indicates whether the current user is the organizer of this event
     * @type {boolean}
     * @memberof Event
     */
    'isOrganizer': boolean;
    /**
     * Indicates whether this event is part of a recurring series
     * @type {boolean}
     * @memberof Event
     */
    'isRecurring': boolean;
    /**
     * The timestamp when this event was last updated
     * @type {string}
     * @memberof Event
     */
    'lastUpdatedAt': string;
    /**
     * The URL that can be used to join the meeting (if available)
     * @type {string}
     * @memberof Event
     */
    'meetingUrl': string;
    /**
     * The title/name of the calendar event
     * @type {string}
     * @memberof Event
     */
    'name': string;
    /**
     * Custom data object
     * @type {{ [key: string]: any | undefined; }}
     * @memberof Event
     */
    'raw': { [key: string]: any | undefined; };
    /**
     * For recurring events, the ID of the parent recurring event series (if applicable)
     * @type {string}
     * @memberof Event
     */
    'recurring_event_id'?: string | null;
    /**
     * The start time of the event in UTC timezone
     * @type {string}
     * @memberof Event
     */
    'startTime': string;
    /**
     * 
     * @type {string}
     * @memberof Event
     */
    'uuid': string;
}

