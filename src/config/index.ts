import { SecretFn, SecretType, SecretTypeMap } from './types'
import logger from '../utils/logging'
import getEnvVariable from './env'
import getAwsParameter from './aws-ssm'
import getAwsSecret from './aws-secrets'

const secretTypeMap: SecretTypeMap = {
  'aws-ssm': getAwsParameter,
  'aws-secrets': getAwsSecret,
  env:  getEnvVariable
}

export const selectSecretMethod = async(): Promise<SecretFn> => {
  const allowedSecretTypes = Object.keys(secretTypeMap)
  const configuredSecretType = await getEnvVariable('SECRET_TYPE', 'env') as SecretType

  if (!allowedSecretTypes.includes(configuredSecretType)) {
    return Promise.reject(new Error(`Unrecognised secret type '${configuredSecretType}' - must be one of ${allowedSecretTypes}`))
  }

  logger.debug(`Using secret type '${configuredSecretType}'`)

  return Promise.resolve(secretTypeMap[configuredSecretType])
}

export { default as getEnv } from './env'
export const getSecret = async(name: string, defaultValue?: string): Promise<string> => {
  return selectSecretMethod()
    .then(fn => {
      logger.debug(`Fetching secret ${name}`)
      return fn(name, defaultValue)
    })
}
