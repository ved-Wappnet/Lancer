import { baseApi } from './baseApi';
import { KEEP_UNUSED_DATA_FOR } from '@/data/Constant';
import type { ProjectPayload, ProjectResponse } from '@/types/project';


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
      keepUnusedDataFor:KEEP_UNUSED_DATA_FOR,
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
