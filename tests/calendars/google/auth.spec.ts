import * as fs from 'fs'
import { getCredentials } from '../../../src/calandars/google/auth'

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

  it('should set the keyFile attribute if a credentials file exists', () => {
    fs.writeFileSync('gcp-credentials.json', JSON.stringify(exampleCredentials))

    const auth = getCredentials()
    expect(auth.credentials).toBeUndefined()
    expect(auth.keyFile).toBeTruthy()

    fs.rmSync('gcp-credentials.json')
  })


  it('should set the credentials attribute if the environment variable exists', () => {
    process.env.GOOGLE_CREDENTIALS = JSON.stringify(exampleCredentials)

    const auth = getCredentials()
    expect(auth.credentials).toBeTruthy()
    expect(auth.keyFile).toBeUndefined()

    process.env = OLD_ENV
  })
  it('should throw an error if unable to configure', () => {
    expect(getCredentials).toThrow("Cannot authenticate with Google")
  })
})
