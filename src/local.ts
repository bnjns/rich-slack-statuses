import { getActiveEvents } from './calandars'
import { getEnv } from './config'

// TODO: this just temporary
(async() => {
  const calendarId = getEnv('CALENDAR_ID')

  const events = await getActiveEvents(calendarId)

  console.log('events', events)
})()
