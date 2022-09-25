import getEnv from '../../src/config/env'

describe('fetching environment variables', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('fetching an environment variable that exists should return that value', async() => {
    expect.assertions(1)
    process.env.EXISTING_ENV = 'value'

    await expect(getEnv('EXISTING_ENV', 'default')).resolves.toEqual('value')
  })
  test('fetching an environment variable that doesn\'t exist with no default should throw an error', async() => {
    expect.assertions(1)

    await expect(getEnv('MISSING_ENV')).rejects.toEqual(new Error('Missing required environment variable: MISSING_ENV'))
  })
  test('fetching an environment variable that doesn\'t exist with a default should return the default', async() => {
    expect.assertions(1)

    await expect(getEnv('MISSING_ENV', 'default')).resolves.toEqual('default')
  })
})
