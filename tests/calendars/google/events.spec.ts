/* eslint-disable camelcase */
import { calendar_v3 } from 'googleapis'
import { mapEvent } from '../../../src/calandars/google/events'
import { DateTime } from 'luxon'

describe('mapping an event to a CalendarEvent', () => {
  const exampleEvent: calendar_v3.Schema$Event = {
    summary: 'Example event',
    description: 'Example description',
    start: {
      dateTime: '2022-09-01T09:00:00Z',
      timeZone: 'Europe/London'
    },
    end: {
      dateTime: '2022-09-01T12:00:00Z',
      timeZone: 'Europe/London'
    },
    status: 'confirmed'
  }

  it('should map the summary to the title', () => {
    const googleEvent = { ...exampleEvent }

    const event = mapEvent(googleEvent)

    expect(event.title).toEqual('Example event')
  })

  it('should provide an empty title if the summary doesn\'t exist', () => {
    const googleEvent = {
      ...exampleEvent,
      summary: undefined
    }

    const event = mapEvent(googleEvent)

    expect(event.title).toEqual('')
  })

  it('should map the description if it\'s set', () => {
    const googleEvent = { ...exampleEvent }

    const event = mapEvent(googleEvent)

    expect(event.description).toEqual('Example description')
  })

  it('should not set the description if it\'s missing', () => {
    const googleEvent = {
      ...exampleEvent,
      description: undefined
    }

    const event = mapEvent(googleEvent)

    expect(event.description).toBeUndefined()
  })

  it('should set the start with the correct timezone', () => {
    const googleEvent = { ...exampleEvent }

    const event = mapEvent(googleEvent)

    expect(event.start.isValid).toBeTruthy()
    expect(event.start.toUTC()).toEqual(DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 9, minute: 0, second: 0 }, { zone: 'UTC' }))
    expect(event.start.zoneName).toEqual('Europe/London')
  })

  it('should handle a start with no timezone', () => {
    const googleEvent = {
      ...exampleEvent,
      start: {
        ...exampleEvent.start,
        timeZone: undefined
      }
    }

    const event = mapEvent(googleEvent)

    expect(event.start.isValid).toBeTruthy()
    expect(event.start.zoneName).toEqual('UTC')
  })

  it('should handle an invalid start', () => {
    const googleEvent = {
      ...exampleEvent,
      start: undefined
    }

    const event = mapEvent(googleEvent)

    expect(event.start.isValid).toBeFalsy()
  })

  it('should set the end with the correct timezone', () => {
    const googleEvent = { ...exampleEvent }

    const event = mapEvent(googleEvent)

    expect(event.end.isValid).toBeTruthy()
    expect(event.end.toUTC()).toEqual(DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 12, minute: 0, second: 0 }, { zone: 'UTC' }))
    expect(event.end.zoneName).toEqual('Europe/London')
  })

  it('should handle an end with no timezone', () => {
    const googleEvent = {
      ...exampleEvent,
      end: {
        ...exampleEvent.end,
        timeZone: undefined
      }
    }

    const event = mapEvent(googleEvent)

    expect(event.end.isValid).toBeTruthy()
    expect(event.end.zoneName).toEqual('UTC')
  })

  it('should handle an invalid end', () => {
    const googleEvent = {
      ...exampleEvent,
      end: undefined
    }

    const event = mapEvent(googleEvent)

    expect(event.end.isValid).toBeFalsy()
  })
})

