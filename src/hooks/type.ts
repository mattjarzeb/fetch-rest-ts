import { FetchClient } from '../'
import { QueryClient } from '@tanstack/react-query'
import { Model } from '../types/Model'

export type FactoryOptions<TModel extends Model = Model> = {
  fetchClient: FetchClient<TModel>
  queryClient: QueryClient
}
