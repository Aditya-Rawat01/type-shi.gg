import TypeScreen from '@/components/TypeScreen';
import './globals.css'

import TypingArea from "@/components/typingArea";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { initialCookieState } from './store/atoms/userCookie';
export default async function page() {
  const sessionCookie = await auth.api.getSession({ headers: await headers() })
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
    <div className="w-screen h-screen flex flex-col">

    <TypeScreen sessionCookie={typeCorrectedUser}/>
    </div>
  )
} 