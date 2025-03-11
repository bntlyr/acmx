"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { useToast } from "~/components/ui/use-toast"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/forum" })
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "There was a problem signing in with Google",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account to post questions and comments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  )
}

