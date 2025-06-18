import { baseApi } from './baseApi';
// You may want to create a types/contract.ts for strong typing
// For now, we'll use any for contract types

export const contractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContracts: builder.query<any, { role: string; userId: string | number }>({
      query: ({ role, userId }) => ({
        url: `/contracts?role=${role}&userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['contracts'],
    }),
    getContractById: builder.query<any, number | string>({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: 'GET',
      }),
      providesTags: ['contracts'],
    }),
    createContract: builder.mutation<any, any>({
      query: (body) => ({
        url: '/contracts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['contracts'],
    }),
    updateContract: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/contracts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['contracts'],
    }),
    deleteContract: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['contracts'],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractByIdQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = contractApi;
