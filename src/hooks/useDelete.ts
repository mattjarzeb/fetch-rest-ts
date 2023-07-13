'use client'
import { Model } from '../types/Model'
import { useMutation as useRMutation, UseMutationOptions } from '@tanstack/react-query'
import { AsPath, WithParams } from '../types/fetchClient'
import pathWithoutParams from '../utils/pathWithoutParams'
import { FactoryOptions } from './type'

export const makeDelete = <TModel extends Model, TError>({ fetchClient, queryClient }: FactoryOptions<TModel>) => {
  return <TPath extends AsPath<TModel>, VPathVars extends WithParams<TModel, TPath, 'pathParams', 'delete'>>(
    path: TPath,
    options: UseMutationOptions<WithParams<TModel, TPath, 'output', 'delete'>, TError, VPathVars> = {},
  ) => {
    const mutationKey = [pathWithoutParams(path)]
    return useRMutation<WithParams<TModel, TPath, 'output', 'delete'>, TError, VPathVars>(
      mutationKey,
      async (pathParams) => {
        return fetchClient.delete(path, pathParams)
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
