import { ParsedEvent } from '../../src/events/types'
import { DateTime } from 'luxon'
import selectEvent, { sortByMostRecent } from '../../src/events/selector'

const baseEvent: Pick<ParsedEvent, 'emoji' | 'setDoNotDisturb' | 'setAway' | 'prioritise'> = {
  emoji: 'calendar',
  setDoNotDisturb: false,
  setAway: false,
  prioritise: false
}

describe('sorting events', () => {
  it('should sort the most recent start first', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T10:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      }
    ]

    const sortedEvents = sortByMostRecent(events)

    expect(sortedEvents.length).toEqual(2)
    expect(sortedEvents[0].title).toEqual('Event 2')
    expect(sortedEvents[1].title).toEqual('Event 1')
  })

  it('should sort with the first to end if the start matches', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T11:00:00Z')
      }
    ]

    const sortedEvents = sortByMostRecent(events)

    expect(sortedEvents.length).toEqual(2)
    expect(sortedEvents[0].title).toEqual('Event 2')
    expect(sortedEvents[1].title).toEqual('Event 1')
  })

  it('should sort by start then end', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T11:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 3',
        start: DateTime.fromISO('2022-09-01T10:00:00Z'),
        end: DateTime.fromISO('2022-09-01T20:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 4',
        start: DateTime.fromISO('2022-09-01T00:00:00Z'),
        end: DateTime.fromISO('2022-09-02T00:00:00Z')
      }
    ]

    const sortedEvents = sortByMostRecent(events)

    expect(sortedEvents.length).toEqual(4)
    expect(sortedEvents[0].title).toEqual('Event 3')
    expect(sortedEvents[1].title).toEqual('Event 2')
    expect(sortedEvents[2].title).toEqual('Event 1')
    expect(sortedEvents[3].title).toEqual('Event 4')
  })
})

describe('selecting an event', () => {
  it('should return the event for a single event list', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      }
    ]

    const event = selectEvent(events)

    expect(event.title).toEqual('Event 1')
  })

  it('should select the first event in the list', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T00:00:00Z'),
        end: DateTime.fromISO('2022-09-02T00:00:00Z')
      }
    ]

    const event = selectEvent(events)

    expect(event.title).toEqual('Event 1')
  })

  it('should select the prioritised event', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T00:00:00Z'),
        end: DateTime.fromISO('2022-09-02T00:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 3',
        start: DateTime.fromISO('2022-09-01T02:00:00Z'),
        end: DateTime.fromISO('2022-09-02T20:00:00Z'),
        prioritise: true
      }
    ]

    const event = selectEvent(events)

    expect(event.title).toEqual('Event 3')
  })

  it('should select the event that starts the latest if multiple are prioritised', () => {
    const events: ParsedEvent[] = [
      {
        ...baseEvent,
        title: 'Event 1',
        start: DateTime.fromISO('2022-09-01T09:00:00Z'),
        end: DateTime.fromISO('2022-09-01T12:00:00Z'),
        prioritise: true
      },
      {
        ...baseEvent,
        title: 'Event 2',
        start: DateTime.fromISO('2022-09-01T00:00:00Z'),
        end: DateTime.fromISO('2022-09-02T00:00:00Z')
      },
      {
        ...baseEvent,
        title: 'Event 3',
        start: DateTime.fromISO('2022-09-01T02:00:00Z'),
        end: DateTime.fromISO('2022-09-02T20:00:00Z'),
        prioritise: true
      }
    ]

    const event = selectEvent(events)

    expect(event.title).toEqual('Event 1')
  })
})
