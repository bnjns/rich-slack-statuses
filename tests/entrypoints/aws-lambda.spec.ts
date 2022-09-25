import handler from '../../src/entrypoints/aws-lambda'

const mockExecute = jest.fn()
jest.mock('../../src/execute', () => {
  return {
    __esModule: true,
    default: () => mockExecute()
  }
})

describe('the handler', () => {
  beforeEach(() => {
    mockExecute.mockClear()
  })

  it('should call the execute function', async() => {
    expect.assertions(1)
    mockExecute.mockImplementationOnce(() => Promise.resolve())

    await handler()

    expect(mockExecute).toHaveBeenCalledTimes(1)
  })

  it('should pass errors back', async() => {
    expect.assertions(1)
    mockExecute.mockImplementationOnce(() => Promise.reject(new Error('Execution failed for some reason')))

    const result = handler()

    await expect(result).rejects.toThrowError('Execution failed for some reason')
  })
})
