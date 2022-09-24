/* eslint-disable camelcase */
import { DateTime } from 'luxon'
import { buildProfile, handleStatus } from '../../src/slack/status'
import { client } from '../../src/slack/client'
import { failedPromise, nonOkPromise, successPromise } from './fixtures'

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


jest.mock('../../src/slack/client', () => ({
  ...(jest.requireActual('../../src/slack/client'))
}))
const mockedClient = client as jest.Mocked<typeof client>

describe('handling a status change', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('no status to update should clear the status', async() => {
    const mockedSet = jest.fn().mockImplementation(successPromise)
    mockedClient.users.profile.set = mockedSet
    const expectedProfile = JSON.stringify({
      status_text: null,
      status_emoji: null,
      status_expiration: null
    })

    await handleStatus()

    expect(mockedSet).toHaveBeenCalledTimes(1)
    expect(mockedSet).toHaveBeenCalledWith({ profile: expectedProfile })
  })

  it('providing a status to update should call the API with that status', async() => {
    const mockedSet = jest.fn().mockImplementation(successPromise)
    mockedClient.users.profile.set = mockedSet
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

    expect(mockedSet).toHaveBeenCalledTimes(1)
    expect(mockedSet).toHaveBeenCalledWith({ profile: expectedProfile })
  })

  it('a request to slack which throws an error should be handled', async() => {
    expect.assertions(1)

    const mockedSet = jest.fn().mockImplementation(failedPromise)
    mockedClient.users.profile.set = mockedSet

    await expect(handleStatus()).rejects.toEqual(new Error('An example error'))
  })
})
