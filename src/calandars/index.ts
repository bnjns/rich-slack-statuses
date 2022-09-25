import { getEnv } from '../config'
import { CalendarTypeMap, CalendarEvent, CalendarType } from './types'
import { getEvents } from './google/events'
import { DateTime } from 'luxon'
import logger from '../utils/logging'

const calendarTypeMap: CalendarTypeMap = {
  'google': getEvents
}

export const getActiveEvents = async(calendarId: string): Promise<CalendarEvent[]> => {
  const allowedCalendars = Object.keys(calendarTypeMap)
  const configuredCalendar = await getEnv('CALENDAR_TYPE', 'google')

  if (!allowedCalendars.includes(configuredCalendar)) {
    return Promise.reject(new Error(`Unrecognised calendar type '${configuredCalendar}' - must be one of ${allowedCalendars}`))
  }

  logger.debug(`Selected calendar type: ${configuredCalendar}`)

  const now = DateTime.now().setZone('UTC')

  logger.info(`Finding events that are active at ${now.toISO()}`)

  return calendarTypeMap[configuredCalendar as CalendarType](now, calendarId)
    .then(events => {
      logger.info(`Found ${events.length} active events`)
      return events
    })
}
