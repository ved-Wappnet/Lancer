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
    createMilestone: builder.mutation<MilestoneResponse, MilestonePayload>({
      query: (body) => ({
        url: '/milestones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['projects'],
    }),
    getMilestones: builder.query<MilestoneResponse[], void>({
      query: () => ({
        url: '/milestones',
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
  }),
});

export const { useCreateMilestoneMutation, useGetMilestonesQuery } = milestoneApi;
