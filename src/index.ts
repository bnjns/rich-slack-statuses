import { getActiveEvents } from './calandars'
import { getEnv } from './config'

const execute = async(calendarId?: string) => {
  // 1. Find all active events
  const activeEvents = getActiveEvents(calendarId || getEnv('CALENDAR_ID'))

  // 2. Choose the event to process
  // 3. Parse the event details
  // 4. Update slack
}

export default execute
