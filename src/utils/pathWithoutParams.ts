const pathWithoutParams = (path: string | symbol | number) =>
  path
    .toString()
    .split('/')
    .filter((e) => !e.startsWith(':'))
    .join('/')

export default pathWithoutParams
