/* eslint-disable camelcase */
import { DateTime } from 'luxon'
import { buildProfile, handleStatus } from '../../src/slack/status'
import { failedPromise, successPromise } from './fixtures'

describe('building the profile', () => {
  it('providing no status should set the text to null', () => {
    const profile = buildProfile()

    expect(JSON.parse(profile)).toMatchObject({
      status_text: null
    })
  })
  it('providing an empty status should set the text to null', () => {
    const profile = buildProfile({
      status: ''
    })

    expect(JSON.parse(profile)).toMatchObject({
      status_text:null
    })
  })
  it('providing a status should set the text to that status', () => {
    const profile = buildProfile({
      status: 'In a meeting'
    })

    expect(JSON.parse(profile)).toMatchObject({
      status_text: 'In a meeting'
    })
  })

  it('providing no emoji should set the emoji to null', () => {
    const profile = buildProfile()

    expect(JSON.parse(profile)).toMatchObject({
      status_emoji: null
    })
  })
  it('providing an empty emoji should set the emoji to null', () => {
    const profile = buildProfile({
      emoji: ''
    })

    expect(JSON.parse(profile)).toMatchObject({
      status_emoji: null
    })
  })
  it('providing an emoji should set a correctly formatted emoji', () => {
    const profile = buildProfile({
      emoji: 'calendar'
    })

    expect(JSON.parse(profile)).toMatchObject({
      status_emoji: ':calendar:'
    })
  })

  it('providing no expiration should set the expiration to null', () => {
    const profile = buildProfile()

    expect(JSON.parse(profile)).toMatchObject({
      status_expiration: null
    })
  })
  it('providing an expiration should set the expiration to the UTC timestamp', () => {
    const date = DateTime.fromISO("2022-09-01T10:45:00Z")
    const expectedTimestamp = 1662029100

    const profile = buildProfile({
      expire: date
    })

    expect(JSON.parse(profile)).toMatchObject({
      status_expiration: expectedTimestamp
    })
  })
})


const mockSetProfile = jest.fn()
jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation(() => {
      return {
        users: {
          profile: {
            set: mockSetProfile
          }
        }
      }
    })
  }
})

describe('handling a status change', () => {
  beforeEach(() => {
    jest.resetModules()
    mockSetProfile.mockClear()
  })

  it('no status to update should clear the status', async() => {
    expect.assertions(2)

    mockSetProfile.mockImplementationOnce(successPromise)
    const expectedProfile = JSON.stringify({
      status_text: null,
      status_emoji: null,
      status_expiration: null
    })

    await handleStatus()

    expect(mockSetProfile).toHaveBeenCalledTimes(1)
    expect(mockSetProfile).toHaveBeenCalledWith({ profile: expectedProfile })
  })

  it('providing a status to update should call the API with that status', async() => {
    expect.assertions(2)

    mockSetProfile.mockImplementation(successPromise)
    const expectedProfile = JSON.stringify({
      status_text: 'status',
      status_emoji: ':emoji:',
      status_expiration: 1662029100
    })

    await handleStatus({
      status: 'status',
      emoji: 'emoji',
      expire: DateTime.fromISO("2022-09-01T10:45:00Z")
    })

    expect(mockSetProfile).toHaveBeenCalledTimes(1)
    expect(mockSetProfile).toHaveBeenCalledWith({ profile: expectedProfile })
  })

  it('a request to slack which throws an error should be handled', async() => {
    expect.assertions(1)

    mockSetProfile.mockImplementationOnce(failedPromise)

    await expect(handleStatus()).rejects.toEqual(new Error('An example error'))
  })
})
