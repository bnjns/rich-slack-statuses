import { CalendarEvent } from '../../src/calandars/types'
import { DateTime } from 'luxon'
import parseEvent, {
  DEFAULT_EMOJI,
  detectAway,
  detectDoNotDisturb,
  detectEmoji, detectPrioritisation,
  DND_EMOJI,
  PREDEFINED_EMOJIS
} from '../../src/events/parser'
import parser from '../../src/events/parser'

const baseEvent: CalendarEvent = {
  title: 'The event title',
  description: 'The event description',
  start: DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 10, minute: 30, second: 0 }, { zone: 'UTC' }),
  end: DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 11, minute: 30, second: 0 }, { zone: 'UTC' })
}

describe('detecting do not disturb', () => {
  describe('title does not contain DND flag', () => {
    const event = { ... baseEvent }
    const foundFlags: string[] = []

    it('should return false', () => {
      const isDoNotDisturb = detectDoNotDisturb(event, foundFlags)

      expect(isDoNotDisturb).toBeFalsy()
    })
    it('should not add the flag to the list', () => {
      expect(foundFlags.length).toEqual(0)
    })
  })

  describe('title is prefixed with DND flag', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: '[DND] Event name'
    }
    const foundFlags: string[] = []
    const isDoNotDisturb = detectDoNotDisturb(event, foundFlags)

    it('should return true', () => {
      expect(isDoNotDisturb).toBeTruthy()
    })

    it('should remove DND flag from the title', () => {
      expect(event.title).toEqual('Event name')
    })

    it('should add the flag to the list', () => {
      expect(foundFlags.length).toEqual(1)
      expect(foundFlags).toContain('DND')
    })
  })

  describe('the DND flag is within the title', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: 'Other name [DND] Event name'
    }
    const foundFlags: string[] = []
    const isDoNotDisturb = detectDoNotDisturb(event, foundFlags)

    it('should return true', () => {
      expect(isDoNotDisturb).toBeTruthy()
    })

    it('should remove DND flag from the title', () => {
      expect(event.title).toEqual('Other name Event name')
    })

    it('should add the flag to the list', () => {
      expect(foundFlags.length).toEqual(1)
      expect(foundFlags).toContain('DND')
    })
  })
})

describe('detecting presence', () => {
  describe('title does not contain AWAY flag', () => {
    const event = { ... baseEvent }
    const foundFlags: string[] = []

    it('should return false', () => {
      const isAway = detectAway(event, foundFlags)

      expect(isAway).toBeFalsy()
    })

    it('should not add the flag to the list', () => {
      expect(foundFlags.length).toEqual(0)
    })
  })

  describe('title is prefixed with AWAY flag', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: '[AWAY] Event name'
    }
    const foundFlags: string[] = []
    const isAway = detectAway(event, foundFlags)

    it('should return true', () => {
      expect(isAway).toBeTruthy()
    })

    it('should remove AWAY flag from the title', () => {
      expect(event.title).toEqual('Event name')
    })

    it('should add the flag to the list', () => {
      expect(foundFlags.length).toEqual(1)
      expect(foundFlags).toContain('AWAY')
    })
  })

  describe('the AWAY flag is within the title', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: 'Other name [AWAY] Event name'
    }
    const foundFlags: string[] = []
    const isAway = detectAway(event, foundFlags)

    it('should return true', () => {
      expect(isAway).toBeTruthy()
    })

    it('should remove AWAY flag from the title', () => {
      expect(event.title).toEqual('Other name Event name')
    })

    it('should add the flag to the list', () => {
      expect(foundFlags.length).toEqual(1)
      expect(foundFlags).toContain('AWAY')
    })
  })
})

describe('detecting the emoji', () => {
  describe('title does not contain any emoji', () => {
    const event = { ... baseEvent }

    it('should return the default emoji', () => {
      const emoji = detectEmoji(event, [])

      expect(emoji).toEqual(DEFAULT_EMOJI)
    })
  })

  describe('title contains an empty emoji', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: 'Event :: name'
    }
    const emoji = detectEmoji(event, [])

    it('should return the default emoji', () => {
      expect(emoji).toEqual(DEFAULT_EMOJI)
    })

    it('should not amend event title', () => {
      expect(event.title).toEqual('Event :: name')
    })
  })

  describe('title contains a non-empty emoji', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: ':custom: Event name'
    }
    const emoji = detectEmoji(event, [])

    it('should return the detected emoji without the colons', () => {
      expect(emoji).toEqual('custom')
    })

    it('should remove the emoji from the event title', () => {
      expect(event.title).toEqual('Event name')
    })

    it('should handle emojis with uppercase letters', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: ':ABC: Event name'
      }

      const emoji = detectEmoji(event, [])

      expect(emoji).toEqual('ABC')
      expect(event.title).toEqual('Event name')
    })

    it('should handle emojis with numbers', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: ':0: Event name'
      }

      const emoji = detectEmoji(event, [])

      expect(emoji).toEqual('0')
      expect(event.title).toEqual('Event name')
    })

    it('should handle emojis with underscores', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: ':a_b_c: Event name'
      }

      const emoji = detectEmoji(event, [])

      expect(emoji).toEqual('a_b_c')
      expect(event.title).toEqual('Event name')
    })

    it('should handle emojis with dashes', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: ':a-b-c: Event name'
      }

      const emoji = detectEmoji(event, [])

      expect(emoji).toEqual('a-b-c')
      expect(event.title).toEqual('Event name')
    })
  })

  describe.each(Object.entries(PREDEFINED_EMOJIS))('title contains the predefined text: %s', (text, expectedEmoji) => {
    describe('when lowercase in the title', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: `Event ${text.toLowerCase()} name`
      }
      const emoji = detectEmoji(event, [])

      it(`should return the emoji: ${expectedEmoji}`, () => {
        expect(emoji).toEqual(expectedEmoji)
      })

      it('should not amend the event title', () => {
        expect(event.title).toEqual(`Event ${text.toLowerCase()} name`)
      })
    })

    describe('when uppercase in the title', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: `Event ${text.toUpperCase()} name`
      }
      const emoji = detectEmoji(event, [])

      it(`should return the emoji: ${expectedEmoji}`, () => {
        expect(emoji).toEqual(expectedEmoji)
      })

      it('should not amend the event title', () => {
        expect(event.title).toEqual(`Event ${text.toUpperCase()} name`)
      })
    })
  })

  describe('an event with both a predefined text and explicit emoji in the title', () => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: `:overridden: Interview`
    }
    const emoji = detectEmoji(event, [])

    it('should return the explicit emoji', () => {
      expect(emoji).toEqual('overridden')
    })
  })

  describe('an event that\'s been identified to have a DND flag', () => {
    const flags = ['DND']

    it(`should set the emoji to ${DND_EMOJI}`, () => {
      const event: CalendarEvent = { ...baseEvent }

      const emoji = detectEmoji(event, flags)

      expect(emoji).toEqual(DND_EMOJI)
    })

    it('should not override a predefined text emoji', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: 'Interview'
      }

      const emoji = detectEmoji(event, flags)

      expect(emoji).toEqual('interview')
    })

    it('should not override an explicit emoji in the title', () => {
      const event: CalendarEvent = {
        ...baseEvent,
        title: ':emoji: Event name'
      }

      const emoji = detectEmoji(event, flags)

      expect(emoji).toEqual('emoji')
    })
  })
})

describe('detecting prioritisation', () => {
  it('should return false if no ! is present', () => {
    const event = { ...baseEvent }

    const prioritised = detectPrioritisation(event)

    expect(prioritised).toBeFalsy()
    expect(event.title).toEqual(baseEvent.title)
  })

  it('should return true if prefixed with ! and remove the prefix from the title', () => {
    const event = {
      ...baseEvent,
      title: `!Event title`
    }

    const prioritised = detectPrioritisation(event)

    expect(prioritised).toBeTruthy()
    expect(event.title).toEqual('Event title')
  })

  it('should return false if ! is not first', () => {
    const event = {
      ...baseEvent,
      title: 'Event ! title'
    }

    const prioritised = detectPrioritisation(event)

    expect(prioritised).toBeFalsy()
    expect(event.title).toEqual('Event ! title')
  })
})

describe('parsing an event', () => {
  const baseEvent: CalendarEvent = {
    title: 'The event title',
    description: 'The event description',
    start: DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 10, minute: 30, second: 0 }, { zone: 'UTC' }),
    end: DateTime.fromObject({ year: 2022, month: 9, day: 1, hour: 11, minute: 30, second: 0 }, { zone: 'UTC' })
  }

  it('should set the title,  start and end', async() => {
    const event: CalendarEvent = { ...baseEvent }

    const parsedEvent = await parseEvent(event)

    expect(parsedEvent.title).toEqual(event.title)
    expect(parsedEvent.start).toEqual(event.start)
    expect(parsedEvent.end).toEqual(event.end)
  })

  it('should detect DND', async() => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: `[DND] ${baseEvent.title}`
    }

    const parsedEvent = await parseEvent(event)

    expect(parsedEvent.setDoNotDisturb).toBeTruthy()
  })

  it('should detect AWAY', async() => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: `[AWAY] ${baseEvent.title}`
    }

    const parsedEvent = await parseEvent(event)

    expect(parsedEvent.setAway).toBeTruthy()
  })

  it('should detect emojis', async() => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: `:emoji: ${baseEvent.title}`
    }

    const parsedEvent = await parseEvent(event)

    expect(parsedEvent.emoji).toEqual('emoji')
  })

  it('should detect prioritised events', async() => {
    const event: CalendarEvent = {
      ...baseEvent,
      title: '!Prioritised event'
    }

    const parsedEvent = await parseEvent(event)

    expect(parsedEvent.prioritise).toBeTruthy()
    expect(parsedEvent.title).toEqual('Prioritised event')
  })
})
