import execute from './index'

type CommandAction = 'execute'
type ActionMap = Record<CommandAction, () => Promise<void>>

(async() => {
  const action = process.argv.slice(2)[0]

  const actionMap: ActionMap = {
    execute
  }

  if (!Object.keys(actionMap).includes(action)) {
    throw Error(`Unknown action: ${action}`)
  }

  await actionMap[action as CommandAction]()
})()
