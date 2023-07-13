import get from 'lodash/get'

const replaceParams = (path: string, values: Record<string, any>) => {
  const parts = path.split('/')
  const partsWithValues = parts.map((part) => {
    if (part.startsWith(':')) {
      const key = part.replace(':', '')
      const value = get(values, key)
      return value.toString()
    }
    return part
  })
  return partsWithValues.join('/')
}

export default replaceParams
