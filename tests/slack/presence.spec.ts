import { client } from '../../src/slack/config'
import { WebAPICallResult } from '@slack/web-api'
import { handlePresence } from '../../src/slack/presence'
import { failedPromise, successPromise } from './fixtures'

jest.mock('../../src/slack/config', () => ({
  ...(jest.requireActual('../../src/slack/config'))
}))
const mockedClient = client as jest.Mocked<typeof client>

describe('setting the presence', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should set presence to away if setaway is true', async() => {
    expect.assertions(2)

    const mockedSetPresence = jest.fn().mockImplementation(successPromise)
    mockedClient.users.setPresence = mockedSetPresence

    await handlePresence({ setAway: true })

    expect(mockedSetPresence).toHaveBeenCalledTimes(1)
    expect(mockedSetPresence).toHaveBeenCalledWith({ presence: 'away' })
  })
  it('should set presence to auto if setaway is false', async() => {
    expect.assertions(2)

    const mockedSetPresence = jest.fn().mockImplementation(successPromise)
    mockedClient.users.setPresence = mockedSetPresence

    await handlePresence({ setAway: false })


    expect(mockedSetPresence).toHaveBeenCalledTimes(1)
    expect(mockedSetPresence).toHaveBeenCalledWith({ presence: 'auto' })
  })
  it('should handle errors', async() => {
    expect.assertions(1)

    const mockedSetPresence = jest.fn().mockImplementation(failedPromise)
    mockedClient.users.setPresence = mockedSetPresence

    await expect(handlePresence({ setAway: false })).rejects.toEqual(new Error('An example error'))
  })
})
