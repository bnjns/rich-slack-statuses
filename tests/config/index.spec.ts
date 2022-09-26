import { selectSecretMethod } from '../../src/config'
import getEnvVariable from '../../src/config/env'
import getParameter from '../../src/config/aws-ssm'

describe('selecting the secret method', () => {
  const OLD_ENV = { ...process.env }

  afterEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  it('should return an error if an invalid secret type is provided', async() => {
    expect.assertions(1)
    process.env.SECRET_TYPE = 'INVALID'

    const result = selectSecretMethod()

    await expect(result).rejects.toThrowError('Unrecognised secret type')
  })

  it('should return the secret fn when a valid type is provided', async() => {
    expect.assertions(1)
    process.env.SECRET_TYPE = 'aws-ssm'

    const result = selectSecretMethod()

    await expect(result).resolves.toBe(getParameter)
  })

  it('should return the env secret fn when no secret type is provided', async() => {
    expect.assertions(1)

    const result = selectSecretMethod()

    await expect(result).resolves.toBe(getEnvVariable)
  })
})
