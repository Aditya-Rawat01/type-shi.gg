import { SignupForm } from "@/components/signup-form"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });
    console.log(session)
    if (session?.user) {
      redirect("/me");
    }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--background)] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
}
