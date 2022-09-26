const mockGetEnv = jest.fn()
const mockGetSecretValue = jest.fn()
jest.mock('@aws-sdk/client-secrets-manager', () => {
  return {
    SecretsManager: jest.fn().mockImplementation(() => ({
      getSecretValue: mockGetSecretValue
    }))
  }
})
jest.mock('../../src/config/env', () => {
  return {
    __esModule: true,
    default: mockGetEnv
  }
})

import getSecret from '../../src/config/aws-secrets'

describe('getting a secret from AWS Secrets Manager', () => {
  afterEach(() => {
    jest.resetModules()
    mockGetSecretValue.mockClear()
  })

  it('should get the secret ID from the environment variable and call getSecretValue', async() => {
    expect.assertions(5)
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() => Promise.resolve({
      SecretString: 'VALUE'
    }))

    const value = await getSecret('EXAMPLE')

    expect(mockGetEnv).toHaveBeenCalledTimes(1)
    expect(mockGetEnv).toHaveBeenCalledWith('EXAMPLE')
    expect(mockGetSecretValue).toHaveBeenCalledTimes(1)
    expect(mockGetSecretValue).toHaveBeenCalledWith({
      SecretId: 'example-secret-id'
    })
    expect(value).toEqual('VALUE')
  })

  it('should handle errors when fetching the environment variable', async() => {
    expect.assertions(1)
    mockGetEnv.mockImplementationOnce(() => Promise.reject(new Error('An error occurred with the environment variable')))

    const result = getSecret('EXAMPLE')

    await expect(result).rejects.toThrowError('An error occurred with the environment variable')
  })

  it('should use the default if the secret has no value', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() => Promise.resolve({
      SecretString: ''
    }))

    const value = await getSecret('EXAMPLE', 'default value')

    expect(value).toEqual('default value')
  })

  it('should return a rejected promise if neither the secret nor default have a value', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() => Promise.resolve({
      SecretString: ''
    }))

    const result = getSecret('EXAMPLE')

    await expect(result).rejects.toThrowError('Secret does not have a value and no default provided')
  })

  it('should return the default if the secret is not found', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() =>  Promise.reject({
      __type: 'ResourceNotFoundException'
    }))

    const value = await getSecret('EXAMPLE', 'default')

    expect(value).toEqual('default')
  })

  it('should return an error if the secret is not found and no default is provided', async() => {
    expect.assertions(1)
    const errorResponse = {
      __type: 'ResourceNotFoundException'
    }
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() =>  Promise.reject(errorResponse))

    const result = getSecret('EXAMPLE')

    await expect(result).rejects.toMatchObject(errorResponse)
  })

  it('should return the error if the ssm client returns an error', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-secret-id')
    mockGetSecretValue.mockImplementationOnce(() =>  Promise.reject('An error occurred in the AWS Secrets Manager client'))

    const result = getSecret('EXAMPLE')

    await expect(result).rejects.toEqual('An error occurred in the AWS Secrets Manager client')
  })
})
