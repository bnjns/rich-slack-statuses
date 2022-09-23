import { DateTime } from 'luxon'

interface CalendarEvent {
  title?: string
  description?: string
  start: DateTime
  end: DateTime
}

export type CalendarFn = (date: DateTime, calendarId: string) => Promise<CalendarEvent[]>
interface CalendarTypeMap {
  [key: string]: CalendarFn
}
