const mockExecute = jest.fn()
const mockExit = jest.fn().mockReturnValue(undefined)
jest.mock('../../src/execute', () => {
  return {
    __esModule: true,
    default: mockExecute
  }
})
jest.mock('process', () => {
  return {
    ...jest.requireActual('process'),
    exit: mockExit
  }
})

describe('the binary executable', () => {
  beforeEach(() => {
    jest.resetModules()
    mockExecute.mockClear()
  })

  it('should call the execute function', async() => {
    expect.assertions(1)
    mockExecute.mockImplementationOnce(() => Promise.resolve())

    await import('../../src/entrypoints/bin')

    expect(mockExecute).toBeCalledTimes(1)
  })

  it('should exit with a non-zero code if execute returns an error', async() => {
    expect.assertions(2)
    mockExecute.mockImplementationOnce(() => { throw new Error('Something went wrong') })

    await import('../../src/entrypoints/bin')

    expect(mockExit).toHaveBeenCalledTimes(1)
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
