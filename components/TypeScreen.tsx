'use client'

import { useEffect, useState } from "react";
import TypingArea from "./typingArea";
import SelectionPanel from "./ui/selectionPanel";
import "../app/page.css";
export default function TypeScreen() {
    const [isMounted,SetisMounted] = useState(false)
    useEffect(()=>{
        setTimeout(()=>{
            SetisMounted(true)
        },3000)
    },[])
    return (
        <div className="w-screen h-screen bg-[#343639] relative">
            
           
           <LoadingUserConfig isMounted={isMounted}/>
           <SelectionPanel/>
            <TypingArea/>
        </div>
    )
}

function LoadingUserConfig({isMounted}:{isMounted:boolean}) {
    return (
        <div className={`w-screen h-screen bg-[#343639] absolute z-50 flex flex-col gap-3 items-center justify-center text-yellow-400 text-3xl ${!isMounted?"opacity-100":"opacity-0 pointer-events-none"}`}>
            <p>Loading User Config . . .</p>
            <span className="loader"></span>
        </div>
    )
}