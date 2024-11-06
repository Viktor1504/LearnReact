import { BaseResponse } from "common/types"
import { LoginArgs } from "./authAPI.types"
import { baseApi } from "../../../app/baseApi"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
    login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
      query: (payload) => {
        return {
          method: "POST",
          url: "auth/login",
          body: payload,
        }
      },
    }),
    logout: build.mutation<BaseResponse, void>({
      query: () => {
        return {
          method: "DELETE",
          url: "auth/login",
        }
      },
    }),
  }),
})

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
