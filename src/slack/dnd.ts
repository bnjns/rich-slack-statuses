import { DateTime } from 'luxon'
import { callWebApi } from './config'
import logger from '../utils/logging'

interface DoNotDisturbParams {
  enable: boolean
  start: DateTime
  end: DateTime
}

export const handleDoNotDisturb = async({ enable, start, end }: DoNotDisturbParams): Promise<void> => {
  if (enable) {
    logger.debug('Enabling do not disturb (snooze)')
    return callWebApi(client => client.dnd.setSnooze({
      // eslint-disable-next-line camelcase
      num_minutes: end.diff(start).as('minutes')
    }))
      .then(() => {
        logger.info('Successfully enabled Do Not Disturb')
      })
      .catch(error => {
        logger.error('Failed to enable Do Not Disturb', error)
      })
  } else {
    logger.debug('Disabling do not disturb (snooze)')
    return callWebApi(client => client.dnd.endSnooze())
      .then(() => {
        logger.info('Successfully disabled Do Not Disturb')
      })
      .catch(error => {
        logger.error('Failed to disable Do Not Disturb', error)
      })
  }
}

