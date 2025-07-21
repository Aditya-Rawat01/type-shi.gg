import ProfilePage from "@/components/profilePage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cookieType, initialCookieState } from "../store/atoms/userCookie";

export default async function page() {
      const sessionCookie = await auth.api.getSession({ headers: await headers() })
      if (!sessionCookie) {
        redirect("/login")
    }
    const notNullUser = sessionCookie!=null
      ?
      {
          session : {
            ...sessionCookie.session,
            expiresAt: sessionCookie.session.expiresAt.toISOString(),
            createdAt: sessionCookie.session.createdAt.toISOString(),
            updatedAt: sessionCookie.session.updatedAt.toISOString()
          }, 
          user : {
            ...sessionCookie.user,
                createdAt: sessionCookie.user.createdAt.toISOString(),
                updatedAt: sessionCookie.user.updatedAt.toISOString()
          }
      }
      :
      {...initialCookieState}
      const typeCorrectedUser = {...notNullUser}
    
    return (
        <div className="h-screen w-screen relative">
            <ProfilePage sessionCookie={typeCorrectedUser}/>
        </div>
    )
} 