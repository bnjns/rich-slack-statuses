/* eslint-disable camelcase */
import { DateTime } from 'luxon'
import { handleDoNotDisturb } from '../../src/slack/dnd'
import { errorText, failedPromise, successPromise } from './fixtures'

const mockSetSnooze = jest.fn()
const mockEndSnooze = jest.fn()
jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation(() => {
      return {
        dnd: {
          setSnooze: mockSetSnooze,
          endSnooze: mockEndSnooze
        }
      }
    })
  }
})

describe('setting the do not disturb', () => {
  beforeEach(() => {
    jest.resetModules()
    mockSetSnooze.mockClear()
    mockEndSnooze.mockClear()
  })

  const start = DateTime.fromISO('2022-09-01T01:15:00Z')
  const end = DateTime.fromISO('2022-09-01T02:45:00Z')
  const diffMinutes = 90

  it('should set snooze with the expected duration when enable is true', async() => {
    expect.assertions(2)
    mockSetSnooze.mockImplementationOnce(successPromise)

    await handleDoNotDisturb({ enable: true, start, end })

    expect(mockSetSnooze).toHaveBeenCalledTimes(1)
    expect(mockSetSnooze).toHaveBeenCalledWith({ num_minutes: diffMinutes })
  })
  it('should handle errors when setting snooze', async() => {
    expect.assertions(1)
    mockSetSnooze.mockImplementationOnce(failedPromise)

    await expect(handleDoNotDisturb({ enable: true, start, end })).rejects.toEqual(new Error(errorText))
  })

  it('should end snooze when enable is false', async() => {
    expect.assertions(1)
    mockEndSnooze.mockImplementationOnce(successPromise)

    await handleDoNotDisturb({ enable: false, start, end })

    expect(mockEndSnooze).toHaveBeenCalledTimes(1)
  })
  it('should handle errors when ending snooze', async() => {
    expect.assertions(1)
    mockEndSnooze.mockImplementationOnce(failedPromise)

    await expect(handleDoNotDisturb({ enable: false, start, end })).rejects.toEqual(new Error('An example error'))
  })
})
