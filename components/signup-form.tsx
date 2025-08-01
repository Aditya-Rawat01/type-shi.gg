"use client";
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { signUp } from "@/serverActions/authHandler";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import hard from "@/public/typeshi2.png"
import Image from "next/image";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    setIsLoading(true);
    const data = await signUp({ email, password, name });
    if (data.success) {
      toast.success(data.msg);
      router.push("/me");
    } else {
      toast.error(data.msg);
    }
    setIsLoading(false);
  }
  async function signInWithGoogle() {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/me",
    });
    console.log(data);
  }
  async function signInWithGithub() {
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/me",
    });
    console.log(data);
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up for your type-shi account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="w-full h-full relative">
                  <Input
                    className="pr-8"
                    id="password"
                    type={!showPass ? "password" : "text"}
                    name="password"
                    placeholder="password"
                    minLength={5}
                    maxLength={25}
                    required
                  />
                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={() => setShowPass((prev) => !prev)}
                  >
                    {!showPass ? (
                      <EyeIcon className="size-5" />
                    ) : (
                      <EyeOffIcon className="size-5" />
                    )}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-2 rounded-xl transition-all duration-300  hover:bg-[var(--backgroundSecondary)] hover:text-[var(--background)] cursor-pointer bg-[var(--background)] text-[var(--text)]"
                disabled={isLoading}
              >
                {!isLoading ? "Signup" : "Signing in..."}
                </button>
            </div>
          </form>
          <div className="col-start-1 flex flex-col gap-6 pb-8">
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 px-2 bg-white text-muted-foreground">
                Or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 px-5">
              <Button
                variant="outline"
                className="w-full cursor-pointer text-[var(--text)]  hover:bg-[var(--backgroundSecondary)] hover:text-[var(--background)]"
                onClick={signInWithGithub}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Signup with GitHub</span>
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer text-[var(--text)]  hover:bg-[var(--backgroundSecondary)] hover:text-[var(--background)]"
                onClick={signInWithGoogle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Signin with Google</span>
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
          <div className="relative hidden bg-muted md:block  col-start-2 row-start-1 row-span-2">
            <Image
              src={hard}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
     
    </div>
  );
}
