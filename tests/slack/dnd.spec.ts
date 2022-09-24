import { DateTime } from 'luxon'
import { client } from '../../src/slack/client'
import { handleDoNotDisturb } from '../../src/slack/dnd'
import { errorText, failedPromise, successPromise } from './fixtures'

jest.mock('../../src/slack/client', () => ({
  ...(jest.requireActual('../../src/slack/client'))
}))
const mockedClient = client as jest.Mocked<typeof client>

describe('setting the do not disturb', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const start = DateTime.fromISO('2022-09-01T01:15:00Z')
  const end = DateTime.fromISO('2022-09-01T02:45:00Z')
  const diffMinutes = 90

  it('should set snooze with the expected duration when enable is true', async() => {
    expect.assertions(2)

    const mockedSetSnooze = jest.fn().mockImplementation(successPromise)
    mockedClient.dnd.setSnooze = mockedSetSnooze

    await handleDoNotDisturb({ enable: true, start, end })
    expect(mockedSetSnooze).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line camelcase
    expect(mockedSetSnooze).toHaveBeenCalledWith({ num_minutes: diffMinutes })
  })
  it('should handle errors when setting snooze', async() => {
    expect.assertions(1)

    const mockedSetSnooze = jest.fn().mockImplementation(failedPromise)
    mockedClient.dnd.setSnooze = mockedSetSnooze

    await expect(handleDoNotDisturb({ enable: true, start, end })).rejects.toEqual(new Error(errorText))
  })

  it('should end snooze when enable is false', async() => {
    expect.assertions(1)

    const mockedEndSnooze = jest.fn().mockImplementation(successPromise)
    mockedClient.dnd.endSnooze = mockedEndSnooze

    await handleDoNotDisturb({ enable: false, start, end })

    expect(mockedEndSnooze).toHaveBeenCalledTimes(1)
  })
  it('should handle errors when ending snooze', async() => {
    expect.assertions(1)

    const mockedEndSnooze = jest.fn().mockImplementation(failedPromise)
    mockedClient.dnd.endSnooze = mockedEndSnooze

    await expect(handleDoNotDisturb({ enable: false, start, end })).rejects.toEqual(new Error('An example error'))
  })
})
