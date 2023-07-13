'use client'
import { Model } from '../types/Model'
import { useMutation as useRMutation, UseMutationOptions } from '@tanstack/react-query'
import { AsPath, MutationConfig, WithParams } from '../types/fetchClient'
import pathWithoutParams from '../utils/pathWithoutParams'
import { FactoryOptions } from './type'

export const makeUpdate = <TModel extends Model, TError>({ fetchClient, queryClient }: FactoryOptions<TModel>) => {
  return <
    TPath extends AsPath<TModel>,
    TVars extends WithParams<TModel, TPath, 'input', 'update'>,
    VPathVars extends WithParams<TModel, TPath, 'pathParams', 'update'>,
  >(
    path: TPath,
    options: UseMutationOptions<
      WithParams<TModel, TPath, 'output', 'update'>,
      TError,
      MutationConfig<TVars, VPathVars>
    > = {},
  ) => {
    const mutationKey = [pathWithoutParams(path)]
    return useRMutation<WithParams<TModel, TPath, 'output', 'update'>, TError, MutationConfig<TVars, VPathVars>>(
      mutationKey,
      async (mutationConfig) => {
        return fetchClient.update(path, mutationConfig)
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
