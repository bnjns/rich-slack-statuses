import { ConfigType, ConfigTypeMap } from './types'
import getEnvVariable from './env'
import logger from '../utils/logging'

const configTypeMap: ConfigTypeMap = {
  env:  getEnvVariable
}

export { default as getEnv } from './env'
export const getSecret = async(name: string, defaultValue?: string): Promise<string> => {
  const configuredConfigType = await getEnvVariable('CONFIG_TYPE', 'env')
  const allowedConfigTypes = Object.keys(configTypeMap)

  if (!allowedConfigTypes.includes(configuredConfigType)) {
    return Promise.reject(new Error(`Unrecognised config type '${configuredConfigType}' - must be one of ${allowedConfigTypes}`))
  }

  logger.debug(`Using config type '${configuredConfigType}' to fetch secret ${name}`)

  return configTypeMap[configuredConfigType as ConfigType](name, defaultValue)
}
