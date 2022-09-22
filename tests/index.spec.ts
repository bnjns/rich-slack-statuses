import { example } from '../src/index'

describe('the index file', () => {
  it('should work', () => {
    expect(example()).toEqual('Example')
  })
})