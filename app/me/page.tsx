import ProfilePage from "@/components/profilePage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
      const sessionCookie = await auth.api.getSession({ headers: await headers() })
      if (!sessionCookie) {
        redirect("/login")
    }
    return (
        <div className="h-screen w-screen relative">
            <ProfilePage sessionCookie={sessionCookie}/>
        </div>
    )
} 