import { getActiveEvents } from './calandars'
import { getEnv } from './config'
import { clearStatus } from './slack'
import logger from './utils/logging'

const execute = async(calendarId?: string) => {
  // 1. Find all active events
  const activeEvents = await getActiveEvents(calendarId || getEnv('CALENDAR_ID'))

  if (activeEvents.length > 0) {
    // 2. Choose the event to process
    // 3. Parse the event details
    // 4. Update slack
  } else {
    logger.info('There are no active events, so clearing any existing Slack status')
    await clearStatus()
  }
}

export default execute
