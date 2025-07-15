import { LoginForm } from "@/components/login-form"
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log(session)
  if (session?.user) {
    redirect("/me"); // redirect is ok here as this will only run if the user is already signed in.
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--background)] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
