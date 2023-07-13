export type BuildInMethods = 'get' | 'create' | 'update' | 'delete'

export type InnerSchema = {
  pathParams?: unknown
  input?: unknown
  output?: unknown
}

type BuildInSchema = {
  [K in BuildInMethods]?: InnerSchema
}

export type Schema = BuildInSchema & {
  [key: `/${string}`]: Schema | BuildInSchema | InnerSchema
}
