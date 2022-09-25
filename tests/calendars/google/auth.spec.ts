import * as fs from 'fs'
import { CREDENTIALS_PATH, getCredentials } from '../../../src/calandars/google/auth'

describe('getting the credentials', () => {
  const OLD_ENV = process.env
  const exampleCredentials = {
    /* eslint-disable camelcase */
    client_email: 'example@google.com',
    private_key: ''
    /* eslint-enable camelcase */
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  it('should set the keyFile attribute if a credentials file exists', async() => {
    expect.assertions(2)
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(exampleCredentials))

    const auth = await getCredentials()
    expect(auth.credentials).toBeUndefined()
    expect(auth.keyFile).toBeTruthy()

    fs.rmSync(CREDENTIALS_PATH)
  })


  it('should set the credentials attribute if the environment variable exists', async() => {
    expect.assertions(2)
    process.env.GOOGLE_CREDENTIALS = JSON.stringify(exampleCredentials)

    const auth = await getCredentials()
    expect(auth.credentials).toBeTruthy()
    expect(auth.keyFile).toBeUndefined()

    process.env = OLD_ENV
  })
  it('should return a rejected promise if unable to configure', async() => {
    expect.assertions(1)

    await expect(getCredentials()).rejects.toThrowError('Cannot authenticate with Google')
  })
})
