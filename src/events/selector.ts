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

  // For now, just select the first event
  const selected = events[0]

  logger.info(`Selected event: ${JSON.stringify(selected)}`)
  return selected
}

export default selectEvent
