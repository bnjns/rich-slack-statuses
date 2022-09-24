import execute from './index'
import { clearStatus, setStatus } from './slack'
import { DateTime } from 'luxon'
import { parseEvent } from './events'

type CommandAction = 'execute' | 'clear-status' | 'set-status'
type ActionMap = Record<CommandAction, () => Promise<void>>

(async() => {
  const action = process.argv.slice(2)[0]

  const actionMap: ActionMap = {
    execute,
    'clear-status': clearStatus,
    'set-status': async() => {
      const event = parseEvent({
        title: process.argv.slice(3)[0] || 'Example event',
        start: DateTime.now(),
        end: DateTime.now().plus({ minute: 5 })
      })

      return setStatus(event)
    }
  }

  if (!Object.keys(actionMap).includes(action)) {
    throw Error(`Unknown action: ${action}`)
  }

  await actionMap[action as CommandAction]()
})()
