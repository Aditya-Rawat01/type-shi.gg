'use client'

import { useEffect, useState } from "react";
import TypingArea from "./typingArea";
import SelectionPanel from "./ui/selectionPanel";
import "../app/page.css";
import ResultPage from "./ResultPage";
import { motion, AnimatePresence } from "motion/react";
export default function TypeScreen() {
    const [isMounted,SetisMounted] = useState(false)
    const [showResultPage, setShowResultPage] = useState(false)
    const [charArray,setCharArray] = useState([0,0,0,0])
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
            duration: 0.3,
          }}
        >
          
           <LoadingUserConfig isMounted={isMounted}/>
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
            duration: 0.3,
          }}
        > 
        <ResultPage setShowResultPage={setShowResultPage} charArray={charArray} setCharArray={setCharArray}/>

        </motion.div>
      )}
      </AnimatePresence>
        </div>
    )}    


function LoadingUserConfig({isMounted}:{isMounted:boolean}) {
    return (
        <div className={`w-screen h-screen bg-[#343639] absolute z-50 flex flex-col gap-3 items-center justify-center text-yellow-400 text-3xl ${!isMounted?"opacity-100":"opacity-0 pointer-events-none"}`}>
            <p>Loading User Config . . .</p>
            <span className="loader"></span>
        </div>
    )
}