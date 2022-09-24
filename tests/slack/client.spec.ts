import { callWebApi, client, WebApiFunction } from '../../src/slack/client'
import { errorText, failedPromise, nonOkPromise, successPromise } from './fixtures'

jest.mock('../../src/slack/client', () => ({
  ...(jest.requireActual('../../src/slack/client'))
}))
const mockedClient = client as jest.Mocked<typeof client>

describe('the slack web client', () => {
  it('should be configured with the correct token', () => {
    expect(client.token).toEqual('FAKE')
  })
})

describe('calling the web api with a function', () => {
  const fn: WebApiFunction = async(client) => client.users.list()

  beforeEach(() => {
    jest.resetModules()
  })

  it('should call the function', async() => {
    expect.assertions(1)
    const fn = jest.fn().mockImplementation(client => client.users.list())
    mockedClient.users.list = jest.fn().mockImplementation(successPromise)

    await callWebApi(fn)

    await expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should resolve if the client returns success', async() => {
    expect.assertions(1)
    mockedClient.users.list = jest.fn().mockImplementation(successPromise)

    const result = callWebApi(fn)

    await expect(result).resolves.toEqual(true)
  })

  it('should reject if the client returns an error', async() => {
    expect.assertions(1)
    mockedClient.users.list = jest.fn().mockImplementation(failedPromise)

    const result = callWebApi(fn)

    await expect(result).rejects.toEqual(new Error(errorText))
  })

  it('should reject if the client succeeds but with a non-ok result', async() => {
    expect.assertions(1)
    mockedClient.users.list = jest.fn().mockImplementation(nonOkPromise)

    const result = callWebApi(fn)

    await expect(result).rejects.toEqual(new Error('The Slack API returned a non-ok status'))
  })
})


