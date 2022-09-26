import { Provider } from '@aws-sdk/types/dist-types/util'
import { Credentials } from '@aws-sdk/types/dist-types/credentials'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

// TODO: test region config?
export const getCredentialProvider = async(): Promise<Provider<Credentials>> => {
  return fromNodeProviderChain({
    clientConfig: {
      region: process.env.AWS_REGION || 'eu-west-1'
    }
  })
}
