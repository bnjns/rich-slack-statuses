import { DateTime } from 'luxon'

interface CalendarEvent {
  title: string
  description?: string
  start: DateTime
  end: DateTime
}

export type CalendarType = 'google'
export type CalendarFn = (date: DateTime, calendarId: string) => Promise<CalendarEvent[]>
export type CalendarTypeMap = Record<CalendarType, CalendarFn>
