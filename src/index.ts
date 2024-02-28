import { Model } from './types/Model'
import replaceParams from './utils/replaceParams'
import { AsPath, GetConfig, GetExtendedConfig, MutationConfig, WithParams } from './types/fetchClient'
import qs from 'qs'
import deepmerge from 'deepmerge'

type FetchClientOptions = {
  baseUrl?: string
  fetchInit?: RequestInit
}

export class FetchClient<TModel extends Model> {
  baseURL: string
  fetchInit: RequestInit

  constructor({ baseUrl = '', fetchInit = {} }: FetchClientOptions) {
    this.baseURL = baseUrl
    this.fetchInit = fetchInit
  }
  protected async getHeaders(headers: RequestInit['headers'] = {}): Promise<Record<string, any>> {
    const defaultHeaders = this.fetchInit.headers || {}
    return {
      'content-type': 'application/json',
      ...defaultHeaders,
      ...headers,
    }
  }

  protected handleError(res: Response, json: any, originalReq: { url: string; fetchInit: RequestInit }) {
    throw new Error(json.message || res.statusText)
  }

  protected getFetchOptions = async (options: RequestInit = {}): Promise<RequestInit> => {
    options.headers = await this.getHeaders(options.headers)
    return deepmerge(this.fetchInit, options)
  }

  protected extractBodyContext(config: MutationConfig<any, any>) {
    const defaultConfig = config || {}
    const body = 'body' in defaultConfig ? defaultConfig.body || {} : defaultConfig
    const pathParams = 'pathParams' in defaultConfig ? defaultConfig.pathParams || {} : body

    return {
      body,
      pathParams,
    }
  }
  protected extractQueryContext(config: GetExtendedConfig<any, any>) {
    const defaultConfig = config || {}
    const query = 'query' in defaultConfig ? defaultConfig.query || {} : defaultConfig
    const pathParams = 'pathParams' in defaultConfig ? defaultConfig.pathParams || {} : query

    return {
      pathParams,
      query,
    }
  }

  async create<
    TPath extends AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'create'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'create'>,
  >(
    path: TPath,
    config?: MutationConfig<TVars, VPathVars>,
    options?: RequestInit,
  ): Promise<WithParams<TModel, TPath, 'output', 'create'>> {
    const _options = await this.getFetchOptions(options)

    const { body, pathParams } = this.extractBodyContext(config)
    const _path = replaceParams((path as string).toString(), pathParams)

    const url = `${this.baseURL}/${_path}`
    const fetchInit: RequestInit = {
      method: 'POST',
      body: JSON.stringify(body),
      ..._options,
    }

    const res = await fetch(url, fetchInit)
    const text = await res.text()
    const json = text ? JSON.parse(text) : undefined
    if (!res.ok) {
      await this.handleError(res, json, { url, fetchInit })
    }
    return json
  }

  async update<
    TPath extends AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'update'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'update'>,
  >(
    path: TPath,
    config?: MutationConfig<TVars, VPathVars>,
    options?: RequestInit,
  ): Promise<WithParams<TModel, TPath, 'output', 'update'>> {
    const _options = await this.getFetchOptions(options)

    const { body, pathParams } = this.extractBodyContext(config)
    const _path = replaceParams((path as string).toString(), pathParams)

    const url = `${this.baseURL}/${_path}`
    const fetchInit: RequestInit = {
      method: 'PATCH',
      body: JSON.stringify(body),
      ..._options,
    }

    const res = await fetch(url, fetchInit)
    const text = await res.text()
    const json = text ? JSON.parse(text) : undefined
    if (!res.ok) {
      await this.handleError(res, json, { url, fetchInit })
    }
    return json
  }

  async delete<TPath extends AsPath<TModel>, VPathVars extends WithParams<TModel, TPath, 'pathParams', 'delete'>>(
    path: TPath,
    pathParams?: VPathVars,
    options?: RequestInit,
  ): Promise<WithParams<TModel, TPath, 'output', 'delete'>> {
    const _options = await this.getFetchOptions(options)

    const _path = replaceParams((path as string).toString(), pathParams || {})

    const url = `${this.baseURL}/${_path}`
    const fetchInit: RequestInit = {
      method: 'DELETE',
      ..._options,
    }
    const res = await fetch(url, fetchInit)
    const text = await res.text()
    const json = text ? JSON.parse(text) : undefined
    if (!res.ok) {
      await this.handleError(res, json, { url, fetchInit })
    }
    return json
  }

  async get<
    TPath extends AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'get'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'get'>,
  >(
    path: TPath,
    config?: GetConfig<TVars, VPathVars>,
    options?: RequestInit,
  ): Promise<WithParams<TModel, TPath, 'output', 'get'>> {
    const _options = await this.getFetchOptions(options)

    const { query, pathParams } = this.extractQueryContext(config || {})

    const _path = replaceParams((path as string).toString(), pathParams || {})

    const queryStrContext = qs.stringify(query)
    const queryStr = queryStrContext ? `?${qs.stringify(query)}` : ''

    const url = `${this.baseURL}/${_path}${queryStr}`
    const fetchInit: RequestInit = {
      method: 'GET',
      ..._options,
    }
    const res = await fetch(url, fetchInit)
    const text = await res.text()
    const json = text ? JSON.parse(text) : undefined
    if (!res.ok) {
      await this.handleError(res, json, { url, fetchInit })
    }
    return json
  }
}
