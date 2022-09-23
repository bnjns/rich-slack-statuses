import { getActiveEvents } from './calandars'
import { getEnv } from './config'

// TODO: this just temporary
(async() => {
  const calendarId = getEnv('CALENDAR_ID')

  await getActiveEvents(calendarId)
})()
