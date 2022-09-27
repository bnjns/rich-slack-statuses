import { DateTime } from 'luxon'

export interface ParsedEvent {
  title: string
  emoji: string
  start: DateTime
  end: DateTime
  setDoNotDisturb: boolean
  setAway: boolean
  prioritise: boolean
}
