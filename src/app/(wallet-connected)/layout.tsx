"use client";
import SignIn from "@/components/sign-in"
import { useCheckAccount } from "@/hooks/use-check-account"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {isConnected} = useCheckAccount()
  if (isConnected) {
    return <>{children}</>
  }

  return <SignIn />
}

export default Layout
