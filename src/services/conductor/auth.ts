import { retry } from "@reduxjs/toolkit/query/react"

import { conductorApi } from "./base-query"

export interface User {}

export const authApi = conductorApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: User }, any>({
      query: () => ({
        url: "login",
        method: "POST",
      }),
      extraOptions: {
        backoff: () => {
          // We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
          retry.fail({ fake: "error" })
        },
      },
    }),
  }),
})

export const { useLoginMutation } = authApi

export const {
  endpoints: { login },
} = authApi
