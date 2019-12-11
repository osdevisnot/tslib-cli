import { sum } from '../src'

describe('template', () => {
  test('exports', () => {
    expect(sum).toBeDefined()
    expect(typeof sum).toEqual('function')
  })
})
