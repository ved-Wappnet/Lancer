import { baseApi } from './baseApi';
import type { Bid, BidPayload, BidResponse, BidApiResponse } from '@/types/bid';

export const bidApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createContract: builder.mutation<any, { bidId: number|string, clientId: number|string, terms: string, amount: number }>({
      query: (body) => ({
        url: '/contracts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['bids'],
    }),
    createBid: builder.mutation<BidApiResponse<BidResponse>, BidPayload & { deliveryTime: any }>({ 
      query: (body) => ({
        url: '/bids',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['bids'],
    }),
    getBids: builder.query<BidApiResponse<BidResponse[]>, void>({
      query: () => ({
        url: '/bids',
        method: 'GET',
      }),
      providesTags: ['bids'],
    }),
    getBidById: builder.query<BidApiResponse<BidResponse>, number | string>({
      query: (id) => ({
        url: `/bids/${id}`,
        method: 'GET',
      }),
      providesTags: ['bids'],
    }),
    updateBid: builder.mutation<BidApiResponse<BidResponse>, { id: number | string; data: Partial<BidPayload> & { status?: string } }>({
      query: ({ id, data }) => ({
        url: `/bids/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['bids'],
    }),
    deleteBid: builder.mutation<BidApiResponse<null>, number | string>({
      query: (id) => ({
        url: `/bids/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['bids'],
    }),
    getContractByBid: builder.query<any, number | string>({
      query: (bidId) => ({
        url: `/contracts/by-bid/${bidId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useCreateBidMutation, useGetBidsQuery, useGetBidByIdQuery, useUpdateBidMutation, useDeleteBidMutation, useCreateContractMutation, useGetContractByBidQuery } = bidApi;
