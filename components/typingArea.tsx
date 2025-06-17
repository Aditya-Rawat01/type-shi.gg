'use client'

import { KeyboardEvent, useEffect, useRef, useState } from "react";
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
  useEffect(() => {
    const containerEl = containerRef.current;
    const cursorEl = cursorElementRef.current;

    if (!containerEl || !cursorEl) return;

    let targetLeft = 0;
    let targetTop = 0;
    // Estimate default height from text size, or use cursor's own CSS if fixed
    let targetHeight = parseFloat(getComputedStyle(containerEl).fontSize) * 1.5 || 28; // Approx line height

    const charElements = containerEl.querySelectorAll<HTMLSpanElement>(`.${CHAR_SPAN_CLASS}`);

    if (words.length === 0 || charElements.length === 0) {
      // No text or elements not rendered yet, position at start of container based on padding
      const computedStyle = getComputedStyle(containerEl);
      targetLeft = parseFloat(computedStyle.paddingLeft) || 0;
      targetTop = parseFloat(computedStyle.paddingTop) || 0;
      const firstCharLikeElement = containerEl.querySelector('span'); // Try to get height from any span
      if (firstCharLikeElement) targetHeight = firstCharLikeElement.getBoundingClientRect().height;

    } else if (pointerIndex < words.length && charElements[pointerIndex]) {
      const charEl = charElements[pointerIndex];
      const charRect = charEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      targetLeft = charRect.left - containerRect.left;
      targetTop = charRect.top - containerRect.top;
      targetHeight = charRect.height;
    } else if (pointerIndex >= words.length && charElements.length > 0) {
      // Cursor at the end of the text
      const lastCharEl = charElements[charElements.length - 1];
      const charRect = lastCharEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      targetLeft = charRect.right - containerRect.left; // Position *after* the last char
      targetTop = charRect.top - containerRect.top;
      targetHeight = charRect.height;
    }
    // Else: pointerIndex might be 0 and words.length > 0 but charElements not ready (rare)
    // or some other edge case, cursor stays at initial 0,0 relative to container or last good pos.

    cursorEl.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
    cursorEl.style.height = `${targetHeight}px`; // Adjust cursor height

    // Optional: Smooth scroll into view
    // const activeElement = charElements[pointerIndex] || charElements[charElements.length - 1];
    // activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

  }, [pointerIndex, words, language]);

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
    'Right','Down','Delete','Insert','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
    'Control'
  ];
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
      //if (pointerIndex===words.length) {}
      // add the missed keys as well and check the cursor and its irregularity
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

  return (
    <div
  ref={containerRef}
  className="h-fit w-full p-5 relative focus:bg-gray-200"
  onFocus={()=>SetFocus(true)}
  onBlur={()=>SetFocus(false)}
  tabIndex={0}
  onKeyDown={handleKeyDown}
> 
 <div className="flex flex-wrap relative">
    <div className={` ${!focus?"absolute":"hidden"} w-full h-full backdrop-blur-md transition-all duration-1000 ease-in`} onClick={()=>SetFocus(true)}>Click to focus ^_^</div>
      {words.map((value, index)=>{
        return (
          
          <span key={index} className={`text-3xl ${CHAR_SPAN_CLASS} ${value.status==="pending"|| value.status ==="missed"?"text-gray-400":value.status==="correct"?"text-green-400":"text-red-400 underline-offset-1 underline"}`} >
            {value.char === " " ? "\u00A0" : value.char}
            </span>
        )
      })}</div>
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
