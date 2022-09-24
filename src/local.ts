import execute from './index'
import { clearStatus, setStatus } from './slack'
import { DateTime } from 'luxon'
import { parseEvent } from './events'
import { getActiveEvents } from './calandars'
import { getEnv } from './config'

type CommandAction = 'execute' | 'clear-status' | 'set-status' | 'get-events'
type ActionMap = Record<CommandAction, () => Promise<void>>

(async() => {
  const action = process.argv.slice(2)[0]

  const actionMap: ActionMap = {
    execute,
    'get-events': async() =>
      getActiveEvents(process.argv.slice(3)[0] || getEnv('CALENDAR_ID'))
        .then(console.log),
    'clear-status': clearStatus,
    'set-status': async() =>
      parseEvent({
        title: process.argv.slice(3)[0] || 'Example event',
        start: DateTime.now(),
        end: DateTime.now().plus({ minute: 5 })
      })
        .then(setStatus)
  }

  if (!Object.keys(actionMap).includes(action)) {
    throw Error(`Unknown action: ${action}`)
  }

  await actionMap[action as CommandAction]()
})()
