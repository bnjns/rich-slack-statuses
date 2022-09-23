/* eslint-disable camelcase */
import { buildProfile } from '../../src/slack/status'
import { DateTime } from 'luxon'

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
