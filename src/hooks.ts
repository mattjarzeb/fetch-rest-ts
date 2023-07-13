import { Model } from './types/Model'
import { FactoryOptions } from './hooks/type'
import { makeGet } from './hooks/useGet'
import { makeCreate } from './hooks/useCreate'
import { makeDelete } from './hooks/useDelete'
import { makeUpdate } from './hooks/useUpdate'

export const hooksFactory = <TModel extends Model, TError = unknown>(options: FactoryOptions<TModel>) => {
  return {
    useGet: makeGet<TModel, TError>(options),
    useCreate: makeCreate<TModel, TError>(options),
    useDelete: makeDelete<TModel, TError>(options),
    useUpdate: makeUpdate<TModel, TError>(options),
  }
}
