import { getEnv } from '../src/config'

describe('fetching environment variables', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('fetching an environment variable that exists should return that value', () => {
    process.env.EXISTING_ENV = 'value'

    const fn = () => getEnv('EXISTING_ENV', 'default')
    expect(fn()).toEqual('value')
  })
  it('fetching an environment variable that doesn\'t exist with no default should throw an error', () => {
    const fn = () => getEnv('MISSING_ENV')

    expect(fn).toThrow('Missing required environment variable')
  })
  it('fetching an environment variable that doesn\'t exist with a default should return the default', () => {
    const fn = () => getEnv('MISSING_ENV', 'default')

    expect(fn()).toEqual('default')
  })
})
