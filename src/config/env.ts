import logger from '../utils/logging'

const getEnvVariable = async(name: string, defaultValue?: string): Promise<string> => {
  logger.debug(`Fetching environment variable ${name}`)

  const val = process.env[name]

  if (val === undefined && defaultValue === undefined) {
    return Promise.reject(new Error(`Missing required environment variable: ${name}`))
  }

  return Promise.resolve((val || defaultValue) as string)
}

export default getEnvVariable
