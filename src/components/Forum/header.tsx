"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menu } from "lucide-react"
import { Button } from "~/components/ui/button"
import { UserNav } from "./user-nav"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"

export function Header() {
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild className="mr-2 md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigate the forum</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              <Link href="/forum" className="text-sm">
                Home
              </Link>
              <Link href="/forum/posts" className="text-sm">
                My Questions
              </Link>
              <Link href="/forum/search" className="text-sm">
                Search
              </Link>
              {isAdmin && (
                <Link href="/forum/admin/dashboard" className="text-sm">
                  Admin
                </Link>
              )}
              <Link href="/forum/profile" className="text-sm">
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Link href="/forum" className="font-semibold text-xl">
            ACMX FORUM
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <UserNav user={session.user} />
            ) : (
              <Link href="/api/forum/auth/signin">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

