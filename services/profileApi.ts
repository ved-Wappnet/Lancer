import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => "profile",
      providesTags:["profile"]
    }),
    updateProfileImage: builder.mutation<any, { image: string }>({
      query: (body) => ({
        url: "profile/image",
        method: "PATCH",
        body,
      }),
      invalidatesTags:["profile"]
    }),
    removeProfileImage: builder.mutation<any, void>({
      query: () => ({
        url: "profile/image",
        method: "DELETE",
      }),
      invalidatesTags:["profile"]
    }),
    updateProfile: builder.mutation<any, { name?: string; password?: string; newPassword?: string }>({
      query: (body) => ({
        url: "profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags:["profile"]
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileImageMutation,
  useRemoveProfileImageMutation,
  useUpdateProfileMutation,
} = profileApi;
