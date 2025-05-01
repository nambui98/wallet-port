import { getSession } from "next-auth/react"

export const getSessionToken = async () => {
  const session = await getSession()
  return session?.accessToken || ""
}
