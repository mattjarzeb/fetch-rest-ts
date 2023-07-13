'use client'
import { Model } from '../types/Model'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AsPath, GetConfig, WithParams } from '../types/fetchClient'
import pathWithoutParams from '../utils/pathWithoutParams'
import { FactoryOptions } from './type'

// as query condition is set in 'options.enable' parameter
type WithUndefined<T> = {
  [key in keyof T]: T[key] | undefined | null
}

export const makeGet = <TModel extends Model, TError = unknown>({ fetchClient }: FactoryOptions<TModel>) => {
  return <
    TPath extends AsPath<TModel> = AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'get'> = WithParams<TModel, TPath, 'input', 'get'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'get'> = WithParams<TModel, TPath, 'pathParams', 'get'>,
  >(
    path: TPath,
    config?: GetConfig<WithUndefined<TVars>, WithUndefined<VPathVars>>,
    options: UseQueryOptions<
      WithParams<TModel, TPath, 'output', 'get'>,
      TError,
      WithParams<TModel, TPath, 'output', 'get'>
    > = {},
  ) => {
    const mutationKey = [pathWithoutParams(path), config]

    return useQuery<WithParams<TModel, TPath, 'output', 'get'>, TError, WithParams<TModel, TPath, 'output', 'get'>>(
      mutationKey,
      // @ts-expect-error
      () => fetchClient.get(path, config),
      {
        ...options,
      },
    )
  }
}
