'use client'

import { useEffect, useRef, useState } from "react";
import TypingArea from "./typingArea";
import SelectionPanel from "./ui/selectionPanel";
import "../app/page.css";
import ResultPage from "./ResultPage";
import { motion, AnimatePresence } from "motion/react";
import { cookieType, userCookie } from "@/app/store/atoms/userCookie";
import { useAtom, useSetAtom } from 'jotai';
import Topbar from "./topbar";
import { charSetsAtom } from "@/app/store/atoms/charSets";
export default function TypeScreen({sessionCookie}:{sessionCookie:cookieType}) {
    const [isMounted,SetisMounted] = useState(false)
    const [showResultPage, setShowResultPage] = useState(false)
    const [charArray,setCharArray] = useAtom(charSetsAtom)
    const setUserCookie = useSetAtom(userCookie)
    useEffect(()=>{
      setUserCookie(sessionCookie)

    },[])
    useEffect(()=>{
        setTimeout(()=>{
            SetisMounted(true)
        },3000)
    },[])

    // idea to show the results page, introduce the show,setshow result page here
    // then pass the setState to typing area and the result page and when the pointerIndex will be equal to the words.length or the time is up
    // then setResultPage to be true among with that have an atom for the results it will carry with it.
    return (
        <div className="w-screen h-screen bg-[#343639] relative">
            
           <AnimatePresence mode="wait">
      {!showResultPage ? (
        <motion.div
          key={"first"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "tween", // or "spring"
            ease: "easeInOut",
            duration: 0.2,
          }}
        >   
           <LoadingUserConfig isMounted={isMounted}/>
            <Topbar/>
           <SelectionPanel/>
            <TypingArea LoadingConfig={isMounted} setShowResultPage={setShowResultPage} setCharArray={setCharArray}/>
        </motion.div>
      ) 
      : 
    (
        <motion.div
          key={"sec"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "tween", // or "spring"
            ease: "easeInOut",
            duration: 0.2,
          }}
        >
          <Topbar/> 
        <ResultPage setShowResultPage={setShowResultPage} charArray={charArray}/>

        </motion.div>
      )}
      </AnimatePresence>
        </div>
    )}    

const arr= ["t","y","p","e","-","s","h","i",".","g","g"]
export function LoadingUserConfig({isMounted}:{isMounted:boolean}) {
  const [charIndex, setCharIndex] = useState(-1)
  const val = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(()=>{
      if (charIndex>=arr.length-1) {
        return
      }
      val.current=setTimeout(()=>{
        setCharIndex((prev)=>prev+1)
      },200)

      return ()=>{
        if (val.current) {
          clearTimeout(val.current)
        }
      }
    },[charIndex])
    return (
        <div className={`w-screen h-screen bg-[#343639] absolute left-0 top-0 z-[100] flex flex-col gap-3 items-center justify-center text-yellow-400 text-3xl ${!isMounted?"opacity-100":"opacity-0 pointer-events-none"}`}>
            <div className="text-5xl">{arr.map((index, valIndex)=>{
              return <span className={ `transition-all duration-200 ${valIndex<=charIndex?`text-yellow-300`:`text-gray-500`}`} key={valIndex}>{index}</span>
            })}</div>
            <span className="loader"></span>
        </div>
    )
}