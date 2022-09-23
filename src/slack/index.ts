import { DateTime } from 'luxon'
import { handleDoNotDisturb } from './dnd'
import { handlePresence } from './presence'
import { handleStatus } from './status'
import { ParsedEvent } from '../events/types'

export const setStatus = async({ title, emoji, start, end, setDoNotDisturb, setAway }: ParsedEvent): Promise<void> => {
  return handleDoNotDisturb({
    enable: setDoNotDisturb,
    start,
    end
  })
    .then(() => handlePresence({ setAway }))
    .then(() => handleStatus({
      status: title,
      emoji,
      expire: end
    }))
}

export const clearStatus = async(): Promise<void> => {
  const now = DateTime.now()

  return handleDoNotDisturb({ enable: false, start: now, end: now })
    .then(() => handlePresence({ setAway: false }))
    .then(() => handleStatus())
}
