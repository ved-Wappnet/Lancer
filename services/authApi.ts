import { baseApi } from "@/services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "auth/signin",
        method: "POST",
        body,
      }),
    }),
    signUp: builder.mutation<any, { name: string; email: string; password: string; role: string }>({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),
    
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
