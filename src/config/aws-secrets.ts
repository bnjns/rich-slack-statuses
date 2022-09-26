import { SecretFn } from './types'
import { getEnv } from './index'
import logger from '../utils/logging'
import { getCredentialProvider } from './aws'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'

const getSecret: SecretFn = async(name, defaultValue): Promise<string> => {
  const secretId = await getEnv(name)

  logger.debug(`Fetching ${name} from AWS Secrets Manager using ID ${secretId}`)

  return getCredentialProvider()
    .then(credentials => new SecretsManager({ credentials }))
    .then(secretsManager => secretsManager.getSecretValue({
      SecretId: secretId
    }))
    .then(response => response.SecretString
      || defaultValue
      || Promise.reject(new Error('Secret does not have a value and no default provided'))
    )
    .catch(err => {
      if (err.__type === 'ResourceNotFoundException' && defaultValue !== undefined) {
        logger.warn(`Did not find secret ${secretId} - returning default value`)
        return defaultValue
      } else {
        logger.error(`Failed to fetch ${name} from secrets manager`)
        return Promise.reject(err)
      }
    })
}

export default getSecret
