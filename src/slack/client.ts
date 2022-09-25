import { getSecret } from '../config'
import { WebAPICallResult, WebClient } from '@slack/web-api'
import logger from '../utils/logging'

export type WebApiFunction = (client: WebClient) => Promise<WebAPICallResult>

let client: WebClient
export const getClient = async(): Promise<WebClient> => {
  if (client === undefined) {
    logger.debug('Creating Slack WebClient')
    const token = await getSecret('SLACK_TOKEN')
    client = new WebClient(token)
  }

  return Promise.resolve(client)
}

export const callWebApi = async(fn: WebApiFunction): Promise<boolean> => getClient()
  .then(fn)
  .then(({ ok }) => ok || Promise.reject(new Error('The Slack API returned a non-ok status')))
  .catch(error => {
    logger.error('Received error from Slack', error)
    return Promise.reject(error)
  })
