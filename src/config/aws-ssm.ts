import { SecretFn } from './types'
import { SSM } from '@aws-sdk/client-ssm'
import logger from '../utils/logging'
import getEnv from './env'
import { getCredentialProvider } from './aws'

const getParameter:SecretFn = async(name, defaultValue): Promise<string> => {
  const parameterName = await getEnv(name)

  logger.debug(`Fetching ${name} from AWS SSM using parameter ${parameterName}`)

  return getCredentialProvider()
    .then(credentials => new SSM({ credentials }))
    .then(ssm => ssm.getParameter({
      Name: parameterName,
      WithDecryption: true
    }))
    .then(response => response.Parameter?.Value
      || defaultValue
      || Promise.reject(new Error('Parameter does not have a value and no default provided'))
    )
    .catch(err => {
      if (err.__type === 'ParameterNotFound' && defaultValue !== undefined) {
        logger.warn(`Did not find parameter ${parameterName} - returning default value`)
        return defaultValue
      } else {
        logger.error(`Failed to fetch ${name} from parameter store`)
        return Promise.reject(err)
      }
    })
}

export default getParameter
