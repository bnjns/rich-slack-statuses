import { CalendarEvent } from '../calandars/types'
import { ParsedEvent } from './types'
import { removeExtraWhitespace } from '../utils/strings'
import logger from '../utils/logging'

const emojiRegex = /:([a-z0-9_\\-]+):/ig
export const DEFAULT_EMOJI = 'calendar'
export const DND_EMOJI = 'no_entry'
export const PREDEFINED_EMOJIS: Record<string, string> = {
  '1:1': 'no_entry',
  'a/l': 'palm_tree',
  'bank holiday': 'palm_tree',
  'focus time': 'no_entry',
  interview: 'interview',
  jira: 'jira2',
  'out of hours': 'zzz',
  travelling: 'car'
}

const containsFlag = (event: CalendarEvent, flag: string, foundFlags: string[]): boolean => {
  const flagText = `[${flag}]`
  const containsFlagText = event.title.includes(flagText)

  if (containsFlagText) {
    logger.debug(`Found flag ${flagText} in event title`)
    event.title = removeExtraWhitespace(event.title.replace(flagText, ''))
    foundFlags.push(flag)
  }

  return containsFlagText
}

export const detectDoNotDisturb = (event: CalendarEvent, foundFlags: string[]): boolean =>
  containsFlag(event, 'DND', foundFlags)

export const detectAway = (event: CalendarEvent, foundFlags: string[]): boolean =>
  containsFlag(event, 'AWAY', foundFlags)

export const detectEmoji = (event: CalendarEvent, flags: string[]): string => {
  const matches = Array.from(event.title.matchAll(emojiRegex))

  // Emoji is provided explicitly in the title
  if (matches.length > 0) {
    logger.debug(`Found ${matches.length} matching emojies in title: ${matches.map(match => match[1])}`)

    const selectedEmoji = matches[0]
    logger.debug(`Selected emoji: ${selectedEmoji[1]}`)
    event.title = removeExtraWhitespace(event.title.replace(selectedEmoji[0], ''))
    return selectedEmoji[1]
  }

  // TODO: Move this to a dedicated bit of logic so it can also set AWAY, DND, etc
  // Check the title against the predefined list
  for (const [text, emoji] of Object.entries(PREDEFINED_EMOJIS)) {
    if (event.title.toLowerCase().includes(text.toLowerCase())) {
      logger.debug(`Found predefined text '${text}' in event title - using emoji ${emoji}`)
      return emoji
    }
  }

  // If the event is marked as DND, set the default DND emoji
  if (flags.includes('DND')) {
    return DND_EMOJI
  }

  return DEFAULT_EMOJI
}

const parseEvent = async(event: CalendarEvent): Promise<ParsedEvent> => {
  try {
    const copiedEvent = { ...event }

    const flags: string[] = []
    const isDoNotDisturb = detectDoNotDisturb(copiedEvent, flags)
    const isAway = detectAway(copiedEvent, flags)
    const emoji = detectEmoji(copiedEvent, flags)

    logger.debug(`Event title has been changed from '${event.title}' to '${copiedEvent.title}'`)

    return Promise.resolve({
      title: copiedEvent.title,
      start: copiedEvent.start,
      end: copiedEvent.end,
      emoji: emoji,
      setDoNotDisturb: isDoNotDisturb,
      setAway: isAway
    })
  } catch (err) {
    return Promise.reject(err)
  }
}

export default parseEvent
