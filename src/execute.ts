import { getActiveEvents } from './calandars'
import { getEnv } from './config'
import { clearStatus, setStatus } from './slack'
import logger from './utils/logging'
import { parseEvent, selectEvent } from './events'

const execute = async(calendarId?: string): Promise<void> =>
  getActiveEvents(calendarId || await getEnv('CALENDAR_ID'))
    .then(activeEvents => {
      if (activeEvents.length > 0) {
        logger.debug('Parsing active events')
        return Promise.all(activeEvents.map(parseEvent))
          .then(events => selectEvent(events))
          .then(event => setStatus(event))
      } else {
        logger.info('There are no active events - clearing any existing Slack status')
        return clearStatus()
      }
    })

export default execute
