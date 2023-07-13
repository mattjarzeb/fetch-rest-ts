import { Model } from '../types/Model'
import { FactoryOptions } from './type'
import { makeGet } from './useGet'
import { makeDelete } from './useDelete'
import { makeCreate } from './useCreate'
import { makeUpdate } from './useUpdate'

export const hookFactory = <TModel extends Model, TError = unknown>(options: FactoryOptions<TModel>) => {
  return {
    useGet: makeGet<TModel, TError>(options),
    useCreate: makeCreate<TModel, TError>(options),
    useDelete: makeDelete<TModel, TError>(options),
    useUpdate: makeUpdate<TModel, TError>(options),
  }
}
