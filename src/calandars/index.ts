import { getEnv } from '../config'
import { CalendarTypeMap, CalendarEvent, CalendarType, CalendarFn } from './types'
import { getEvents } from './google/events'
import { DateTime } from 'luxon'
import logger from '../utils/logging'

const calendarTypeMap: CalendarTypeMap = {
  'google': getEvents
}

export const selectCalendarMethod = async(): Promise<CalendarFn> => {
  const allowedCalendars = Object.keys(calendarTypeMap)
  const configuredCalendar = await getEnv('CALENDAR_TYPE', 'google') as CalendarType

  if (!allowedCalendars.includes(configuredCalendar)) {
    return Promise.reject(new Error(`Unrecognised calendar type '${configuredCalendar}' - must be one of ${allowedCalendars}`))
  }

  logger.debug(`Selected calendar type: ${configuredCalendar}`)

  return Promise.resolve(calendarTypeMap[configuredCalendar])
}


export const getActiveEvents = async(calendarId: string): Promise<CalendarEvent[]> => {
  const now = DateTime.now().setZone('UTC')
  logger.info(`Finding events that are active at ${now.toISO()}`)

  return selectCalendarMethod()
    .then(fn => fn(now, calendarId))
    .then(events => {
      logger.info(`Found ${events.length} active events`)
      return events
    })
}
