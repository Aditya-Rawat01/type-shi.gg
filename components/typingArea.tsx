'use client'

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import axios from 'axios'
import { URI } from "@/lib/URI";
import generateTest from "@/lib/seed-Generation";
import { toast } from "sonner";
import '../app/page.css'
const CHAR_SPAN_CLASS = "char-element";
export default function TypingArea() {
  const [language,setLanguage] = useState('English')
  const [words,setWords] = useState<{
    char: string;
    status: string;
}[]>([])
  const [wordList,setWordList] = useState<string[]>([])
  const mode = 'words' // have to be set by maybe cookies or something else like localstorage.
  const wordsLen:number|null = 50
  const time:number|null = null
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pointerIndex,setPointerIndex] = useState(0)
  const cursorElementRef = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const [blinking, setBlinking] = useState(true);
const [focus, SetFocus] = useState(false)

  useEffect(() => {
    containerRef.current?.focus();

        
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);
  // took help from gemini for the cursor irregularities.
  

    // Cursor positioning
 useEffect(() => {
  if (!focus) return;

  requestAnimationFrame(() => {
    const containerEl = containerRef.current;
    const cursorEl = cursorElementRef.current;

    if (!containerEl || !cursorEl) return;

    let targetLeft = 0;
    let targetTop = 0;
    let targetHeight = 28;

    const charElements = containerEl.querySelectorAll<HTMLSpanElement>(`.${CHAR_SPAN_CLASS}`);

    if (pointerIndex < words.length && charElements[pointerIndex]) {
      const charEl = charElements[pointerIndex];
      const charRect = charEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      // Position cursor BEFORE the character (for a typing app)
      targetLeft = charRect.left - containerRect.left;
      targetTop = charRect.top - containerRect.top;
      targetHeight = charRect.height;
    } else if (charElements.length > 0) {
      const lastCharEl = charElements[charElements.length - 1];
      const charRect = lastCharEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      targetLeft = charRect.right - containerRect.left;
      targetTop = charRect.top - containerRect.top;
      targetHeight = charRect.height;
    }

    cursorEl.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
    cursorEl.style.height = `${targetHeight}px`;
  });
}, [pointerIndex, words, focus]);
 // words identity changes, so this will run. `focus` to update on focus change.

  useEffect(() => {
    if (!focus) return;
    const textFlowArea = containerRef.current?.querySelector<HTMLDivElement>('.text-flow-area');
    if (!textFlowArea || words.length === 0) return;

    const charElements = textFlowArea.querySelectorAll<HTMLSpanElement>(`.${CHAR_SPAN_CLASS}`);
    let activeElement: HTMLSpanElement | null = null;

    if (pointerIndex < words.length && charElements[pointerIndex]) {
      activeElement = charElements[pointerIndex];
    } else if (pointerIndex >= words.length && charElements.length > 0) {
      activeElement = charElements[Math.min(pointerIndex, charElements.length - 1)];
    }
    
    activeElement?.scrollIntoView({
      behavior: 'auto', // 'smooth' can feel laggy if called too often
      block: 'center',
      inline: 'nearest'
    });
  }, [pointerIndex, words.length, focus]);

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
      setWordList(res.data.msg.words)
    }
    getWords()
  },[language])
  const specialKeys = [
    'Tab','Enter','Shift','Ctrl','Alt','Meta','CapsLock','Esc','PageUp','PageDown','End','Home','Left','Up',
    'Right','Down','Delete','Insert','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
    'Control'
  ];
  // const getTest=useMemo(()=> {
  //   const response=generateTest({mode:mode, wordList, wordsLen:wordsLen, time:time })
  //     // the error is not being toasted. see the error why
  //     // after that send this uuid and its hash to the backend to generate and compare the strings.

  //     // the error is not being toasted when the words are undefined because of the type of property here.
  //     if (typeof response === "string") {
  //       toast.error(response)
  //       return <div> Error occurred.</div>
  //     }
  //     setWords(response)
  //   },[wordsLen,time,mode])
 

  //const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleKeyDown(e:KeyboardEvent<HTMLSpanElement>) {
    // if (!timeRef) {
    //   //timeRef = 
    // }
    e.preventDefault()
    const key = e.key
    let charsSkipped = 1;
    console.log({key,original:words[pointerIndex].char}) 
    if (specialKeys.includes(key) || e.ctrlKey || e.metaKey) return
    //nested if is required here , if i put both the conditions on same level then first letter will get red mark due to first backspace, kinda glitch
    //reason key is backspace but the pointer index is zero so else condition will run and mark the first letter as the incorrect! 
    else if (key === "Backspace" ) {
      if (pointerIndex>0) {
        
        setWords((prev) =>{
          const data = [...prev]
         if (data[pointerIndex-1].status==="extra") {
          data.splice(pointerIndex-1,1)
         } else {
           data[pointerIndex-1].status = "pending"
         }
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

        } else if (key===' ' && data[pointerIndex].char!=' ') {

          if (pointerIndex!=0) {
            if (data[pointerIndex-1].char!=' ') {
              let iterator = pointerIndex 
              while (data[iterator].char!=' ') {
                data[iterator].status='missed'
                iterator++;
              }
              charsSkipped=iterator+1-pointerIndex
            }
          }
        }
        else {
          if (data[pointerIndex].char===' '){
            if (data[pointerIndex-1].status!="extra") {

              data.splice(pointerIndex,0,{
                char:key,
                status:"extra"
              })
            }
          } else {
            data[pointerIndex].status = "incorrect"
          }


        }
        return data
      })
      if (pointerIndex>0) {
        if ( words[pointerIndex-1].char==' ' && key==' ') {
          return
        } else if (words[pointerIndex-1].status!="extra" || key==' '){
          setPointerIndex((prev)=>prev+charsSkipped)
        }
        
      } else {
        key!=' '?setPointerIndex((prev)=>prev+charsSkipped):null
      }
      charsSkipped=1
    }
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }
    if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
    }
    setBlinking(false);
    
    focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false)
    }, 5000);
    blinkTimeoutRef.current = setTimeout(() => {
      setBlinking(true);
      // Ensure container still has focus for blinking cursor to be relevant
      // containerRef.current?.focus();
    }, 500);
    console.log(e.key)
  }

  // very expensive operation but useMemo will not benefit as the words are getting new reference with each render.
  const wordGroups: { char: string; status: string }[][] = [];
    let currentWord: { char: string; status: string }[] = [];
    
    words.forEach((char, index) => {
      currentWord.push(char);
      if (char.char === " ") {
        wordGroups.push(currentWord);
        currentWord = [];
      }
    });
    if (currentWord.length) wordGroups.push(currentWord); // because last character will not have the gap after that
  return (
    <div
  ref={containerRef}
  className="h-fit w-[85%] p-5 relative focus:bg-gray-200 flex items-center justify-center"
  onFocus={()=>SetFocus(true)}
  onBlur={()=>SetFocus(false)}
  tabIndex={0}
  onKeyDown={handleKeyDown}
> 
 <div className="text-flow-area flex flex-wrap gap-0.5 leading-14 text-[33px] bg-black relative h-44 overflow-y-auto">
    <div className={` ${!focus?"absolute":"hidden"} w-full h-full backdrop-blur-xs bg-transparent transition-all duration-1000 ease-in`} onClick={()=>SetFocus(true)} onWheel={(e) => e.preventDefault()}
  onTouchMove={(e) => e.preventDefault()}
  onScroll={(e) => e.preventDefault()}>
      Click to focus ^_^
    </div>
      {wordGroups.map((word, wordIndex) => (
  <span key={`${word}-${wordIndex}`} className="inline-block">
    {word.map((value, charIndex) => {
      // Get actual index in flat array

      return (
        <span
          key={`${word}-${wordIndex}-${value}-${charIndex}`}
          className={`${CHAR_SPAN_CLASS} ${
            value.status === "pending" || value.status === "missed"
              ? "text-gray-400"
              : value.status === "correct"
              ? "text-green-400"
              : "text-red-400 underline"
          }`}
        >
          {value.char === " " ? "\u2002" : value.char}
        </span>
      );
    })}
  </span>
))}</div>
      <div
      
        ref={cursorElementRef}
        id="cursor" // ID can still be useful for debugging or specific CSS
        className={`absolute rounded-sm bg-amber-500 
                    transition-all duration-[155ms] ease-out 
                    ${blinking ? "animate-blink" : "opacity-100"}
                    w-0.5`} // Tailwind: w-0.5 is 2px. Or w-px for 1px.
                    // Height is set by JS.
        style={{
          left: 0, // Initial position, transform will override
          top: 0,
        }}
      />
    </div>
  );
}
            //<span className={`h-10 w-1 bg-black ${index===pointerIndex?"absolute":"invisible"}`}></span>
// return (
          
//         //   <span key={index} className={`${CHAR_SPAN_CLASS} ${value.status==="pending"|| value.status ==="missed"?"text-gray-400":value.status==="correct"?"text-green-400":"text-red-400 underline-offset-1 underline"}`} >
//         //     {value.char === " " ? "\u2002" : value.char}
//         //     </span>
//         // )