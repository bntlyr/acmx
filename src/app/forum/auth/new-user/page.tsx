import { NewUserForm } from "~/components/Forum/new-user-form"

export default function NewUserPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Forum App</h1>
      <p className="text-center text-muted-foreground mb-8">Please create a username to continue</p>
      <NewUserForm />
    </div>
  )
}

