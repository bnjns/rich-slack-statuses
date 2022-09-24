import * as path from 'path'
import * as process from 'process'
import * as fs from 'fs'
import { Auth } from 'googleapis'
import logger from '../../utils/logging'

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
export const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || path.join(process.cwd(), 'gcp-credentials.json')
const CREDENTIALS_ENV_NAME = 'GOOGLE_CREDENTIALS'

export const getCredentials = (): Pick<Auth.GoogleAuthOptions, 'keyFile' | 'credentials'> => {
  if (fs.existsSync(CREDENTIALS_PATH)) {
    logger.debug(`Loading credentials from file: ${CREDENTIALS_PATH}`)
    return {
      keyFile: CREDENTIALS_PATH
    }
  } else if (process.env[CREDENTIALS_ENV_NAME] !== undefined) {
    logger.debug(`Loading credentials from ${CREDENTIALS_ENV_NAME} environment variable`)

    return {
      credentials: JSON.parse(process.env[CREDENTIALS_ENV_NAME])
    }
  } else {
    throw Error('Cannot authenticate with Google - make sure you have configured a recognised authentication mechanism')
  }
}

export const getAuthClient = async() => {
  const auth = new Auth.GoogleAuth({
    scopes: SCOPES,
    ...getCredentials()
  })
  return auth.getClient()
}

