// eslint-disable-next-line camelcase
import { google, calendar_v3 } from 'googleapis'
import { DateTime } from 'luxon'
import { CalendarEvent, CalendarFn } from '../types'
import { getAuthClient } from './auth'
import logger from '../../utils/logging'

// eslint-disable-next-line camelcase
export const mapEvent = (event: calendar_v3.Schema$Event): CalendarEvent => {
  return {
    title: event.summary || '',
    description: event.description || undefined,
    start: DateTime.fromISO(event.start?.dateTime || '', { zone: event.start?.timeZone || 'UTC' }),
    end: DateTime.fromISO(event.end?.dateTime || '', { zone: event.end?.timeZone || 'UTC' })
  }
}

export const getEvents: CalendarFn = async(date: DateTime, calendarId: string): Promise<CalendarEvent[]> => {
  const auth = await getAuthClient()

  const timeMin = date.toISO()
  const timeMax = date.plus({ minute: 1 }).toISO()
  logger.debug(`Searching for events between ${timeMin} and ${timeMax}`)

  return google.calendar({ auth, version: 'v3' }).events.list({
    calendarId,
    maxResults: 10,
    orderBy: 'startTime',
    singleEvents: true,
    timeMin,
    timeMax
  })
    .then(response => (response.data.items || []).filter(event => event.status !== 'cancelled'))
    .then(events => events.map(mapEvent))
}
