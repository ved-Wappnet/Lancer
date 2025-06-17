import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';

export type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'delayed';

export interface MilestonePayload {
  title: string;
  description: string;
  projectId: number;
  dueDate: string;
  progress: number;
  status: number; // 1-4, matches backend DB
}

export interface MilestoneResponse {
  id: number;
  title: string;
  description: string;
  projectId: number;
  dueDate: string;
  progress: number;
  status: number; // 1-4, matches backend DB
  createdAt: string;
  updatedAt: string;
  project?: {
    id: number;
    title: string;
    // add any other project fields you want to use
  };
}

export const milestoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMilestone: builder.mutation<{ success: boolean; message: string; data: MilestoneResponse }, MilestonePayload>({
      query: (body) => ({
        url: '/milestones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['projects'],
    }),
    updateMilestone: builder.mutation<{ success: boolean; message: string; data: MilestoneResponse }, { id: number | string; data: Partial<MilestonePayload> }>({
      query: ({ id, data }) => ({
        url: `/milestones/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['projects'],
    }),
    deleteMilestone: builder.mutation<{ success: boolean; message: string; data: null }, number | string>({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['projects'],
    }),
    getMilestones: builder.query<{ success: boolean; message: string; data: MilestoneResponse[] }, void>({
      query: () => ({
        url: '/milestones',
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
  }),
});

export const { useCreateMilestoneMutation, useGetMilestonesQuery, useUpdateMilestoneMutation, useDeleteMilestoneMutation } = milestoneApi;
