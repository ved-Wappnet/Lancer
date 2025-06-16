import { ProjectStatus } from '@/models/Project';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from './baseApi';

export interface ProjectPayload {
  title: string;
  description: string;
  category: number;
  budget: string;
  deadline?: string;
  status: number;
  skillsRequired?: string[]; // New field
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  category: number;
  budget: string;
  deadline?: string | null;
  status: number;
  skillsRequired?: string[]; // New field
  createdAt: string;
  updatedAt: string;
}

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<ProjectResponse, ProjectPayload>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['projects'],
    }),
    getProjects: builder.query<ProjectResponse[], void>({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
    updateProject: builder.mutation<ProjectResponse, { id: number | string } & ProjectPayload>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['projects'],
    }),
    getProjectById: builder.query<ProjectResponse, number | string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
      providesTags: ['projects'],
    }),
  }),
});

export const { useCreateProjectMutation, useGetProjectsQuery, useUpdateProjectMutation, useGetProjectByIdQuery } = projectApi;
