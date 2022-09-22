import { getEnv } from '../config'
import { CalendarTypeMap, CalendarEvent } from './types'
import { getEvents } from './google/events'
import { DateTime } from 'luxon'
import logger from '../utils/logging'

const calendarTypeMap: CalendarTypeMap = {
  'google': getEvents
}

const configuredCalendar = getEnv('CALENDAR_TYPE', 'google')

export const getActiveEvents = async(calendarId: string): Promise<CalendarEvent[]> => {
  const allowedCalendars = Object.keys(calendarTypeMap)

  if (!allowedCalendars.includes(configuredCalendar)) {
    throw Error(`Unrecognised calendar type '${configuredCalendar}' - must be one of ${allowedCalendars}`)
  }

  logger.debug(`Selected calendar type: ${configuredCalendar}`)

  const now = DateTime.now().setZone('UTC')

  logger.info(`Finding events that are active at ${now.toISO()}`)

  return calendarTypeMap[configuredCalendar](now, calendarId)
    .then(events => {
      logger.info(`Found ${events.length} events`)
      return events
    })
}
