import { ParsedEvent } from './types'
import logger from '../utils/logging'

export const sortByMostRecent = (events: ParsedEvent[]): ParsedEvent[] =>
  [...events].sort((a, b) => {
    const aStart = a.start.toMillis()
    const bStart = b.start.toMillis()

    if (aStart === bStart) {
      return a.end.toMillis() - b.end.toMillis()
    } else {
      return bStart - aStart
    }
  })

const selectEvent = (events: ParsedEvent[]): ParsedEvent => {
  events = sortByMostRecent(events)

  // Find the first prioritised event
  const prioritised = events.filter(event => event.prioritise)
  if (prioritised.length > 0) {
    return prioritised[0]
  }

  // Fall back to the first event
  return events[0]
}

export default function(events: ParsedEvent[]): ParsedEvent {
  const selected = selectEvent(events)
  logger.info(`Selected event: ${JSON.stringify(selected)}`)
  return selected
}
