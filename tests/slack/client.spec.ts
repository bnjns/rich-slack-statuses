import { callWebApi, getClient, WebApiFunction } from '../../src/slack/client'
import { errorText, failedPromise, nonOkPromise, successPromise } from './fixtures'

const mockUserList = jest.fn()
const mockGetSecret = jest.fn()
jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation((token?: string) => {
      return {
        token,
        users: {
          list: mockUserList
        }
      }
    })
  }
})
jest.mock('../../src/config', () => {
  return {
    getSecret: jest.fn().mockImplementation(() => mockGetSecret())
  }
})

describe('getting the slack client', () => {
  beforeEach(() => {
    jest.resetModules()
    mockGetSecret.mockClear()
  })

  it('should be given the correct slack token', async() => {
    expect.assertions(2)
    mockGetSecret.mockReturnValue('MOCKED_TOKEN')

    const client = await getClient()

    expect(mockGetSecret).toHaveBeenCalledTimes(1)
    expect(client.token).toEqual('MOCKED_TOKEN')
  })
})

describe('calling the web api with a function', () => {
  const fn: WebApiFunction = async(client) => client.users.list({})

  beforeEach(() => {
    jest.resetModules()
    mockUserList.mockClear()
  })

  it('should call the function', async() => {
    expect.assertions(1)
    mockUserList.mockImplementationOnce(successPromise)

    const fn = jest.fn().mockImplementation(client => client.users.list())
    await callWebApi(fn)

    await expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should resolve if the client returns success', async() => {
    expect.assertions(1)
    mockUserList.mockImplementationOnce(successPromise)

    const result = callWebApi(fn)

    await expect(result).resolves.toEqual(true)
  })

  it('should reject if the client returns an error', async() => {
    expect.assertions(1)
    mockUserList.mockImplementationOnce(failedPromise)

    const result = callWebApi(fn)

    await expect(result).rejects.toEqual(new Error(errorText))
  })

  it('should reject if the client succeeds but with a non-ok result', async() => {
    expect.assertions(1)
    mockUserList.mockImplementationOnce(nonOkPromise)

    const result = callWebApi(fn)

    await expect(result).rejects.toEqual(new Error('The Slack API returned a non-ok status'))
  })
})


