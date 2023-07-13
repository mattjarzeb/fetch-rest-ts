'use client'
import { Model } from '../types/Model'
import { useMutation as useRMutation, UseMutationOptions } from '@tanstack/react-query'
import { MutationConfig, WithParams, AsPath } from '../types/fetchClient'
import { FactoryOptions } from './type'

export const makeCreate = <TModel extends Model, TError>({ fetchClient, queryClient }: FactoryOptions<TModel>) => {
  return <
    TPath extends AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'create'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'create'>,
  >(
    path: TPath,
    options: UseMutationOptions<
      WithParams<TModel, TPath, 'output', 'create'>,
      TError,
      MutationConfig<TVars, VPathVars>
    > = {},
  ) => {
    const mutationKey = [path]
    return useRMutation<WithParams<TModel, TPath, 'output', 'create'>, TError, MutationConfig<TVars, VPathVars>>(
      mutationKey,
      async (mutationConfig) => {
        return fetchClient.create(path, mutationConfig)
      },
      {
        ...options,
        onSuccess: (...args) => {
          queryClient.invalidateQueries(mutationKey)
          options.onSuccess?.(...args)
        },
      },
    )
  }
}
