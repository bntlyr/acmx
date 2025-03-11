import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "~/components/ui/toaster"
import { ThemeProvider } from "~/components/Forum/theme-provider"
import { Header } from "~/components/Forum/header"
import { Footer } from "~/components/Forum/footer"
import { AuthProvider } from "~/components/Forum/auth-provider"
import { AppSidebar } from "~/components/Forum/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Forum App",
  description: "A forum application similar to Reddit and Stack Overflow",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex flex-1">
                <div className="hidden md:flex">
                  <AppSidebar />
                </div>
                <main className="flex-1 overflow-y-auto">
                  <div className="container py-6 md:py-12">{children}</div>
                </main>
              </div>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

