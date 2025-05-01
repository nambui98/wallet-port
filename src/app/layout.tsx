import type { Metadata } from "next"

import "@rainbow-me/rainbowkit/styles.css"
import "./globals.scss"

import AuthProvider from "@/providers/auth-provider"
import { MoralisProvider } from "@/providers/moralis-provider"
import QueryClientProvider from "@/providers/query-client-provider"
import StoreProvider from "@/providers/store-provider"
import WalletProvider from "@/providers/wallet-provider"

import { siteConfig } from "@/config/site"
import { fontMontserrat } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/common/toaster"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import NavigationBottomBar from "@/components/layout/nav-bottom-bar"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL ?? ""),
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    images: ["/seo-image-1200x628-t.jpg"],
  },
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(fontMontserrat.className)}
        suppressHydrationWarning={true}
      >
        <Toaster />
        <AuthProvider>
          <StoreProvider>
            <MoralisProvider>
              <WalletProvider>
                <main className="bg-dark-100 relative min-w-[375px] overflow-hidden">
                  <div className="bg-primary-linear absolute left-[-524px] top-[-144px] z-0 h-[450px] w-[1477px] select-none rounded-full opacity-30 blur-[200px] 2xl:h-[1235px] 2xl:w-[1977px]" />
                  <div className="relative flex flex-col pb-[90px] lg:pb-0">
                    <Header />
                    <div className=" flex w-full ">
                      <div className="box-container mx-auto w-full p-4 md:min-h-screen lg:p-0">
                        {children}
                      </div>
                    </div>
                    <Footer />
                    <NavigationBottomBar />
                  </div>
                </main>
              </WalletProvider>
            </MoralisProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
