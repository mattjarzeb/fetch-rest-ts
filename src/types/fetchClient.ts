import { BuildInMethods, InnerSchema } from './schema'

export type KeyStr<T extends object> = Extract<keyof T, string>

export type WithParams<
  TObj extends Record<string, any>,
  TPath extends string,
  TKey extends string,
  TMethod extends string = '',
> = TPath extends `${infer S1 extends KeyStr<TObj>}/${infer S2}`
  ? WithParams<TObj[S1], `/${S2}`, TKey, TMethod>
  : TMethod extends keyof TObj[TPath]
  ? TKey extends keyof TObj[TPath][TMethod]
    ? TObj[TPath][TMethod][TKey]
    : unknown
  : TPath extends `${infer S1 extends ''}/${infer S2}/${infer S3}`
  ? WithParams<TObj[`/${S2}`], `/${S3}`, TKey, TMethod>
  : unknown

export type ValidKey<T> = T extends keyof InnerSchema ? false : T extends BuildInMethods ? false : true

export type AsPath<T extends Record<string, any>> = {
  [K in keyof T]: K extends string
    ? ValidKey<K> extends true
      ? K | `${K}${T[K] extends object ? `${AsPath<T[K]>}` : ''}`
      : never
    : never
}[keyof T]

type MutationExtendedConfig<V, PV = undefined> = {
  pathParams: PV
  body: V
}

export type MutationConfig<V, PV> = (V & PV) | MutationExtendedConfig<V, PV>

export type GetExtendedConfig<V, VP> = {
  pathParams?: VP
  query?: V
}

export type GetConfig<V, PV> = GetExtendedConfig<V, PV> | (V & PV)
