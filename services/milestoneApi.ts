import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';
import type { MilestonePayload, MilestoneResponse } from '@/types/milestone';

export const milestoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMilestone: builder.mutation<{ success: boolean; message: string; data: MilestoneResponse }, MilestonePayload>({
      query: (body) => ({
        url: '/milestones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['milestones'],
    }),
    updateMilestone: builder.mutation<{ success: boolean; message: string; data: MilestoneResponse }, { id: number | string; data: Partial<MilestonePayload> }>({
      query: ({ id, data }) => ({
        url: `/milestones/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['milestones'],
    }),
    deleteMilestone: builder.mutation<{ success: boolean; message: string; data: null }, number | string>({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['milestones'],
    }),
    getMilestones: builder.query<{ success: boolean; message: string; data: MilestoneResponse[] }, void>({
      query: () => ({
        url: '/milestones',
        method: 'GET',
      }),
      providesTags: ['milestones'],
    }),
  }),
});

export const { useCreateMilestoneMutation, useGetMilestonesQuery, useUpdateMilestoneMutation, useDeleteMilestoneMutation } = milestoneApi;
