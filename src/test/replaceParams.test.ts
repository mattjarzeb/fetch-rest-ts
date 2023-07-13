import replaceParams from '../utils/replaceParams'

describe('Replace params', () => {
  it('should replace single param', () => {
    const url = replaceParams('users/:id', { id: '1' })
    expect(url).toStrictEqual('users/1')
  })
  it('should replace param in the middle', () => {
    const url = replaceParams('users/:id/posts', { id: '1' })
    expect(url).toStrictEqual('users/1/posts')
  })
  it('should replace multiple params', () => {
    const url = replaceParams('users/:id/posts/:name', { id: '1', name: 'bob' })
    expect(url).toStrictEqual('users/1/posts/bob')
  })
  it('should replace with trailing slash', () => {
    const url = replaceParams('users/:id/', { id: '1' })
    expect(url).toStrictEqual('users/1/')
  })
  it('should replace with path nested field', () => {
    const url = replaceParams('users/:nested.id', { nested: { id: '2' } })
    expect(url).toStrictEqual('users/2')
  })
  it('should ignore extra keys in object', () => {
    const url = replaceParams('users/:nested.id', { id: '1', nested: { id: '2' } })
    expect(url).toStrictEqual('users/2')
  })
})
