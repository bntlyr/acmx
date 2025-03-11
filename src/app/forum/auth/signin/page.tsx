import { SignInForm } from "~/components/Forum/sign-in-form"

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
      <SignInForm />
    </div>
  )
}

