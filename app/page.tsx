'use client'

import { KeyboardEvent, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { URI } from "@/lib/URI";
import generateTest from "@/lib/seed-Generation";
import { toast } from "sonner";
import "./page.css"
export default function Home() {
  const [language,setLanguage] = useState('English')
  const [words,setWords] = useState<{
    char: string;
    status: string;
}[]>([])
  const mode = 'words' // have to be set by maybe cookies or something else like localstorage.
  const wordsLen:number|null = 50
  const time:number|null = null

  const [pointerIndex,setPointerIndex] = useState(0)
  const cursorRef = useRef<HTMLSpanElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const [blinking, setBlinking] = useState(true);

  useEffect(() => {
  const charEl = cursorRef.current;
  const containerEl = containerRef.current;
  const cursorEl = document.getElementById("cursor");

  if (charEl && containerEl && cursorEl) {
    const charRect = charEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    cursorEl.style.left = `${charRect.left - containerRect.left}px`;
    cursorEl.style.top = `${charRect.top - containerRect.top}px`;
  }
}, [pointerIndex]);

  useEffect(()=>{
    async function getWords() {
      const res = await axios.get(`${URI}/api/language/${language}`)
      const response=generateTest({mode:mode, wordList:res.data.msg.words as string[], wordsLen:wordsLen, time:time })
      // the error is not being toasted. see the error why
      // after that send this uuid and its hash to the backend to generate and compare the strings.

      // the error is not being toasted when the words are undefined because of the type of property here.
      if (typeof response === "string") {
        toast.error(response)
        return <div> Error occurred.</div>
      }
      setWords(response)
    }
    getWords()
  },[language])
  const specialKeys = [
    'Tab','Enter','Shift','Ctrl','Alt','Meta','CapsLock','Esc','PageUp','PageDown','End','Home','Left','Up',
    'Right','Down','Delete','Insert','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
  ];
  let blinkTimeout: ReturnType<typeof setTimeout>;
  function handleKeyDown(e:KeyboardEvent<HTMLSpanElement>) {
    const key = e.key
    if (specialKeys.includes(key)) return

    //nested if is required here , if i put both the conditions on same level then first letter will get red mark due to first backspace, kinda glitch
    //reason key is backspace but the pointer index is zero so else condition will run and mark the first letter as the incorrect! 
    else if (key === "Backspace" ) {
      if (pointerIndex>0) {
       setWords((prev) =>{
        const data = [...prev]
        data[pointerIndex-1].status = "pending"
        return data
      })
      setPointerIndex((prev)=>prev-1) 
      }
    }
    else {
      setWords((prev) =>{
        const data = [...prev]
        if (key === data[pointerIndex].char) {
          data[pointerIndex].status = "correct"
        } else {
          data[pointerIndex].status = "incorrect"

        }
        return data
      })
      setPointerIndex((prev)=>prev+1)

    }
    clearTimeout(blinkTimeout);
  setBlinking(false);
  blinkTimeout = setTimeout(() => setBlinking(true), 500);
    console.log(e.key)
  }
  return (
    <div
  ref={containerRef}
  className="h-screen w-screen relative"
  tabIndex={0}
  onKeyDownCapture={handleKeyDown}
> 
 <div className="">
      {words.map((value, index)=>{
        return (
          <>
          
          <span ref={index === pointerIndex ? cursorRef : null} className={`text-3xl ${value.status==="pending"?"text-gray-400":value.status==="correct"?"text-green-400":"text-red-400 underline-offset-1 underline"}`} key={index}>
            {value.char}
            </span>
          </>
        )
      })}</div>
      <div
    id="cursor"
    className={`w-[2px] h-9 rounded-full bg-black absolute ${blinking?"animate-blink":null}`}
    style={{ left: 0, top: 0 }}
  />
    </div>
  );
}
            //<span className={`h-10 w-1 bg-black ${index===pointerIndex?"absolute":"invisible"}`}></span>
