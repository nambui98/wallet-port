import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    idToken: string
    refreshToken: string
    accessToken: string
    expires: number
    user?: TUser
  }
  interface User extends DefaultUser, TLoginResponse {
    error?: string
    id?: string
    phone?: string
    given_name?: string
    family_name?: string
    country_of_residence?: string
  }
  interface JWT extends DefaultJWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    expires?: number
  }
}

export type TAuth = {
  username: string
  password: string
}
export type TUser = {
  id?: string
  email: string
  phone?: string
  given_name?: string
  family_name?: string
  country_of_residence?: string
}

export type TLoginResponse = {
  email?: string
  idToken: string
  refreshToken: string
  accessToken: string
  expires: number
}
