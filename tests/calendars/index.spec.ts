import { selectCalendarMethod } from '../../src/calandars'
import { getEvents as getEventsGoogle } from '../../src/calandars/google/events'


describe('selecting the calendar method', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  it('should return an error if an invalid calendar type is provided', async() => {
    expect.assertions(1)
    process.env.CALENDAR_TYPE = 'INVALID'

    const result = selectCalendarMethod()

    await expect(result).rejects.toThrowError('Unrecognised calendar type')
  })

  it('should return the calendar fn when a valid type is provided', async() => {
    expect.assertions(1)
    process.env.CALENDAR_TYPE = 'google'

    const result = selectCalendarMethod()

    await expect(result).resolves.toBe(getEventsGoogle)
  })

  it('should return the google calendar fn when no calendar type is provided', async() => {
    expect.assertions(1)

    const result = selectCalendarMethod()

    await expect(result).resolves.toBe(getEventsGoogle)
  })
})
