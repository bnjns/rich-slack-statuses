import { getActiveEvents } from './calandars'
import { getEnv } from './config'
import { clearStatus } from './slack'
import logger from './utils/logging'
import { parseEvent } from './events'

const execute = async(calendarId?: string): Promise<void> =>
  getActiveEvents(calendarId || getEnv('CALENDAR_ID'))
    .then(activeEvents => {
      if (activeEvents.length > 0) {
        logger.debug('Parsing active events')
        return Promise.all(activeEvents.map(parseEvent))
          .then(events => console.log(events))
          // Select the event
          // Update slack
      } else {
        logger.info('There are no active events - clearing any existing Slack status')
        return clearStatus()
      }
    })

export default execute
