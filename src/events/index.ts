import { CalendarEvent } from '../calandars/types'
import { ParsedEvent } from './types'

export const parseEvent = ({ title, start, end }: CalendarEvent): ParsedEvent => {
  // TODO: actually parse the event
  return {
    title,
    emoji: 'calendar',
    start,
    end,
    setDoNotDisturb: title.includes('DND'),
    setAway: title.includes('AWAY')
  }
}
