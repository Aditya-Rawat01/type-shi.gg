import TypeScreen from '@/components/TypeScreen';
import './globals.css'

import TypingArea from "@/components/typingArea";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
export default async function page() {
  const sessionCookie = await auth.api.getSession({ headers: await headers() })
  return (
    <div className="w-screen h-screen flex flex-col">

    <TypeScreen sessionCookie={sessionCookie}/>
    </div>
  )
} 