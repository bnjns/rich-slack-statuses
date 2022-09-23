import { DateTime } from 'luxon'
import { callWebApi } from './config'
import logger from '../utils/logging'

interface StatusParams {
  status?: string
  emoji?: string
  expire?: DateTime
}

export const buildProfile = (params?: StatusParams): string => JSON.stringify({
  'status_text': params?.status || null,
  'status_emoji': params?.emoji ? `:${params.emoji}:` : null,
  'status_expiration': params?.expire ? params.expire.toUTC().toSeconds() : null
})

export const handleStatus = async(params?: StatusParams): Promise<void> => {
  const profile = buildProfile(params)

  logger.debug(`Configuring profile to ${profile}`)

  return callWebApi(client => client.users.profile.set({ profile }))
    .then(() => {
      params ? logger.info(`Successfully set status`) : logger.info(`Successfully cleared status`)
    })
    .catch(error => {
      params ? logger.error(`Failed to set status to ${profile}`, error) : logger.error(
        'Failed to clear status',
        error
      )
    })
}
