import { handlePresence } from '../../src/slack/presence'
import { failedPromise, successPromise } from './fixtures'

const mockSetPresence = jest.fn()
jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation(() => {
      return {
        users: {
          setPresence: mockSetPresence
        }
      }
    })
  }
})

describe('setting the presence', () => {
  beforeEach(() => {
    jest.resetModules()
    mockSetPresence.mockClear()
  })

  it('should set presence to away if setaway is true', async() => {
    expect.assertions(2)

    mockSetPresence.mockImplementationOnce(successPromise)

    await handlePresence({ setAway: true })

    expect(mockSetPresence).toHaveBeenCalledTimes(1)
    expect(mockSetPresence).toHaveBeenCalledWith({ presence: 'away' })
  })
  it('should set presence to auto if setaway is false', async() => {
    expect.assertions(2)

    mockSetPresence.mockImplementationOnce(successPromise)

    await handlePresence({ setAway: false })


    expect(mockSetPresence).toHaveBeenCalledTimes(1)
    expect(mockSetPresence).toHaveBeenCalledWith({ presence: 'auto' })
  })
  it('should handle errors', async() => {
    expect.assertions(1)

    mockSetPresence.mockImplementationOnce(failedPromise)

    await expect(handlePresence({ setAway: false })).rejects.toEqual(new Error('An example error'))
  })
})
