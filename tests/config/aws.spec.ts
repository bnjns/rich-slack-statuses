const mockFromNodeProviderChain = jest.fn()
jest.mock('@aws-sdk/credential-providers', () => {
  return {
    fromNodeProviderChain: mockFromNodeProviderChain
  }
})

import { getCredentialProvider } from '../../src/config/aws'

describe('getting the credential provider', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    jest.resetModules()
    mockFromNodeProviderChain.mockClear()
  })

  test('should configure the credentials with the provided region', async() => {
    expect.assertions(2)
    process.env.AWS_REGION = 'us-east-1'

    await getCredentialProvider()

    expect(mockFromNodeProviderChain).toHaveBeenCalledTimes(1)
    expect(mockFromNodeProviderChain).toHaveBeenCalledWith({
      clientConfig: {
        region: 'us-east-1'
      }
    })
  })

  test('should configure the credentials with eu-west-1 if no region provided', async() => {
    expect.assertions(1)

    await getCredentialProvider()

    expect(mockFromNodeProviderChain).toHaveBeenCalledWith({
      clientConfig: {
        region: 'eu-west-1'
      }
    })
  })

  afterEach(() => {
    process.env = OLD_ENV
  })
})
