const mockGetEnv = jest.fn()
const mockGetParameter = jest.fn()
jest.mock('@aws-sdk/client-ssm', () => {
  return {
    SSM: jest.fn().mockImplementation(() => ({
      getParameter: mockGetParameter
    }))
  }
})
jest.mock('../../src/config/env', () => {
  return {
    __esModule: true,
    default: mockGetEnv
  }
})

import getParameter from '../../src/config/aws-ssm'

describe('getting a parameter from AWS SSM', () => {
  afterEach(() => {
    jest.resetModules()
    mockGetEnv.mockClear()
    mockGetParameter.mockClear()
  })

  it('should get the parameter name from the environment variable and call getParameter', async() => {
    expect.assertions(5)
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() => Promise.resolve({
      Parameter: {
        Value: 'VALUE'
      }
    }))

    const value = await getParameter('EXAMPLE')

    expect(mockGetEnv).toHaveBeenCalledTimes(1)
    expect(mockGetEnv).toHaveBeenCalledWith('EXAMPLE')
    expect(mockGetParameter).toHaveBeenCalledTimes(1)
    expect(mockGetParameter).toHaveBeenCalledWith({
      Name: 'example-parameter-name',
      WithDecryption: true
    })
    expect(value).toEqual('VALUE')
  })

  it('should handle errors when fetching the environment variable', async() => {
    expect.assertions(1)
    mockGetEnv.mockImplementationOnce(() => Promise.reject(new Error('An error occurred with the environment variable')))

    const result = getParameter('EXAMPLE')

    await expect(result).rejects.toThrowError('An error occurred with the environment variable')
  })

  it('should use the default if the parameter has no value', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() => Promise.resolve({
      Parameter: {
        Value: ''
      }
    }))

    const value = await getParameter('EXAMPLE', 'default value')

    expect(value).toEqual('default value')
  })

  it('should return a rejected promise if neither the parameter nor default have a value', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() => Promise.resolve({
      Parameter: {
        Value: ''
      }
    }))

    const result = getParameter('EXAMPLE')

    await expect(result).rejects.toThrowError('Parameter does not have a value and no default provided')
  })

  it('should return the default if the parameter is not found', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() =>  Promise.reject({
      __type: 'ParameterNotFound'
    }))

    const value = await getParameter('EXAMPLE', 'default')

    expect(value).toEqual('default')
  })

  it('should return an error if the parameter is not found and no default is provided', async() => {
    expect.assertions(1)
    const errorResponse = {
      __type: 'ParameterNotFound'
    }
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() =>  Promise.reject(errorResponse))

    const result = getParameter('EXAMPLE')

    await expect(result).rejects.toMatchObject(errorResponse)
  })

  it('should return the error if the ssm client returns an error', async() => {
    expect.assertions(1)
    mockGetEnv.mockReturnValue('example-parameter-name')
    mockGetParameter.mockImplementationOnce(() =>  Promise.reject('An error occurred in the AWS SSM client'))

    const result = getParameter('EXAMPLE')

    await expect(result).rejects.toEqual('An error occurred in the AWS SSM client')
  })
})
