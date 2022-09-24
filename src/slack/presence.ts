import { callWebApi } from './config'
import logger from '../utils/logging'

export interface PresenceParams {
  setAway: boolean
}

export const handlePresence = async({ setAway }: PresenceParams): Promise<void> => {
  const presence = setAway ? 'away' : 'auto'

  logger.debug(`Setting presence to ${presence} (setAway = ${setAway})`)
  return callWebApi(client => client.users.setPresence({ presence }))
    .then(() => {
      logger.info(`Successfully set presence to ${presence}`)
    })
    .catch(error => {
      logger.warn(`Failed to set presence to ${presence}`, error)
      return Promise.reject(error)
    })
}
