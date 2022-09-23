import { getEnv } from '../config'
import { WebAPICallResult, WebClient } from '@slack/web-api'
import logger from '../utils/logging'

const getClient = (): WebClient => {
  const token = getEnv('SLACK_TOKEN')
  return new WebClient(token)
}

export const callWebApi = async(fn: (client: WebClient) => Promise<WebAPICallResult>): Promise<boolean> => {
  return fn(getClient())
    .then(({ ok }) => ok)
    .then(ok => ok || Promise.reject(Error('The Slack API returned a non-ok status')))
    .catch(error => {
      logger.error(`Received error from Slack`, error)
      return Promise.reject(error)
    })
}
