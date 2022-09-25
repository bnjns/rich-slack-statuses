import { SecretType, SecretTypeMap } from './types'
import getEnvVariable from './env'
import logger from '../utils/logging'

const secretTypeMap: SecretTypeMap = {
  env:  getEnvVariable
}

export { default as getEnv } from './env'
export const getSecret = async(name: string, defaultValue?: string): Promise<string> => {
  const configuredSecretType = await getEnvVariable('SECRET_TYPE', 'env')
  const allowedSecretTypes = Object.keys(secretTypeMap)

  if (!allowedSecretTypes.includes(configuredSecretType)) {
    return Promise.reject(new Error(`Unrecognised secret type '${configuredSecretType}' - must be one of ${allowedSecretTypes}`))
  }

  logger.debug(`Using type '${configuredSecretType}' to fetch secret ${name}`)

  return secretTypeMap[configuredSecretType as SecretType](name, defaultValue)
}
