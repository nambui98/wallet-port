import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const authRoutes = ["/login", "/sign-up", "/forgot-password", "/profile"]

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/solana-rpc")) {
    const newHeaders = new Headers()
    newHeaders.set("Content-Type", "application/json")
    return NextResponse.next({
      request: {
        // New request headers
        headers: newHeaders,
      },
    })
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (token && authRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/", req.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }

  if (!token && !authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: ["/login", "/sign-up", "/forgot-password", "/profile"],
}
