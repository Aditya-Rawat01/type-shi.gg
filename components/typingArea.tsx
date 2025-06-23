"use client";

import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { URI } from "@/lib/URI";
import generateTest from "@/lib/seed-Generation";
import { toast } from "sonner";
import "../app/page.css";
import { modeAtom } from "@/app/store/atoms/mode";
import { useAtomValue } from "jotai";
const CHAR_SPAN_CLASS = "char-element";
export default function TypingArea() {
  const [language, setLanguage] = useState("English");
  const [words, setWords] = useState<
    {
      char: string;
      status: string;
    }[]
  >([]);
  const [wordList, setWordList] = useState<string[]>([]);
  //const mode:"words"|"time" = 'time' // have to be set by maybe cookies or something else like localstorage.
  const selection = useAtomValue(modeAtom);
  const testWordlength: number | null = 50;
  const time: number | null = null;
  const [pointerIndex, setPointerIndex] = useState(0);
  const cursorElementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blinking, setBlinking] = useState(true);
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [focus, SetFocus] = useState(true); // initially it should be true
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const numberOfGenerations = useRef(1);
  const [firstVisibleCharIndex, setFirstVisibleCharIndex] = useState(0); // this helps in remembering the first char that is visible on screen
  const secondLineTopRef = useRef<{ top: number; index: number } | null>(null); // for the second Line
  // the top tells us the second line top position, index tells us if the first ever scroll happened or not.
  //index tells us the current first character of second line
  const currentWordRef = useRef<HTMLSpanElement | null>(null);

  const textFlowAreaRef = useRef<HTMLDivElement>(null); // for the container
  const cursorAnimationRef = useRef<number | null>(0);

  useEffect(() => {
    //containerRef.current?.focus();
    // as soon as the page mounts (duplicate will be applied/run only once)
    focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false);
    }, 10000); // initially it is more

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

  const CachedFnToHandleMouseMovement = useCallback(() => {
    if (!focus) {
      // If we lose focus, we should cancel any pending animation.
      setBlinking(false);
      if (cursorAnimationRef.current) {
        cancelAnimationFrame(cursorAnimationRef.current);
      }
      return;
    }

    if (cursorAnimationRef.current) {
      cancelAnimationFrame(cursorAnimationRef.current);
    }

    cursorAnimationRef.current = requestAnimationFrame(() => {
      const textFlowArea = textFlowAreaRef.current;
      const cursorEl = cursorElementRef.current;
      if (!textFlowArea || !cursorEl || !containerRef.current) {
        return; // Safely exit if the component has unmounted.
      }
      const charElements = textFlowArea.querySelectorAll<HTMLSpanElement>(
        `.${CHAR_SPAN_CLASS}`
      );

      // Determine the index of the active character within the *visible* set of characters
      const localPointerIndex = pointerIndex - firstVisibleCharIndex;

      // Exit if the active character isn't rendered or doesn't exist
      if (localPointerIndex < 0 || localPointerIndex >= charElements.length) {
        // Hide cursor if it's out of the rendered view (e.g., during a scroll transition)
        cursorEl.style.opacity = "0";
        return;
      }
      cursorEl.style.opacity = "1";

      const activeCharEl = charElements[localPointerIndex];
      const activeCharRect = activeCharEl.getBoundingClientRect();
      const firstCharRect = charElements[0].getBoundingClientRect();
      const lastVisibleCharEl = charElements[charElements.length - 1];
      const lastVisibleCharRect = lastVisibleCharEl.getBoundingClientRect();
      const isOnLastLine = activeCharRect.top === lastVisibleCharRect.top;

      const isSecondLineRefValid =
        secondLineTopRef.current?.index === firstVisibleCharIndex;
      // this will become equal if the scroll has happened and the second line has become the first line.
      // means this shows the stale value
      if (
        isSecondLineRefValid &&
        activeCharRect.top > secondLineTopRef.current!.top &&
        !isOnLastLine
      ) {
        let firstLineLength = 0;
        for (let i = 1; i < charElements.length; i++) {
          const currentCharRect = charElements[i].getBoundingClientRect();
          if (currentCharRect.top > firstCharRect.top) {
            firstLineLength = i;
            break;
          }
        }

        if (firstLineLength > 0) {
          setFirstVisibleCharIndex((prev) => prev + firstLineLength);

          return;
        }
      }
      if (activeCharRect.top > firstCharRect.top && !isSecondLineRefValid) {
        secondLineTopRef.current = {
          top: activeCharRect.top,
          index: firstVisibleCharIndex,
        };
      }

      const containerRect = containerRef.current!.getBoundingClientRect();
      let targetLeft = activeCharRect.left - containerRect.left;
      let targetTop = activeCharRect.top - containerRect.top;
      let targetHeight = activeCharRect.height;

      if (pointerIndex === words.length) {
        const lastCharEl = charElements[charElements.length - 1];
        const lastCharRect = lastCharEl.getBoundingClientRect();
        targetLeft = lastCharRect.right - containerRect.left;
        targetTop = lastCharRect.top - containerRect.top;
        targetHeight = lastCharRect.height;
      }

      cursorEl.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
      cursorEl.style.height = `${targetHeight}px`;
    });
  }, [pointerIndex, focus, firstVisibleCharIndex, words]);
  useEffect(() => {
    CachedFnToHandleMouseMovement(); // runs only on mount
    let handleDebounce: ReturnType<typeof setTimeout>;
    const resizeFn = () => {
      clearTimeout(handleDebounce);
      handleDebounce = setTimeout(() => {
        secondLineTopRef.current = null;
        console.log("reached here");
        if (textFlowAreaRef.current) {
          // crazy thing here is that the firstVisibleChar ref contains the stale value when resized but that doesnt matter as
          // we are using the scrollIntoView and as soon as we type a word then the firstVisible char will get updated as well.
          // good thing due to stale value is that when we resize the window back to its original size then the cursor also gets 
          // back to its original position as the non touched resized window.
          currentWordRef.current?.scrollIntoView(
            {
              behavior: "auto",
              block: "center",
              inline: "nearest",
            } 
          );
        }
        CachedFnToHandleMouseMovement();
      }, 1500);
    };
    window.addEventListener("resize", resizeFn);
    return () => window.removeEventListener("resize", resizeFn);
  }, [CachedFnToHandleMouseMovement]);

  useEffect(() => {
    async function getWords() {
      const res = await axios.get(`${URI}/api/language/${language}`);
      const response = generateTest({
        mode: selection.mode,
        wordList: res.data.msg.words as string[],
        testWordlength,
      });
      // the error is not being toasted. see the error why
      // after that send this uuid and its hash to the backend to generate and compare the strings.

      // the error is not being toasted when the words are undefined because of the type of property here.
      if (typeof response === "string") {
        toast.error(response);
        return <div> Error occurred.</div>;
      }
      setWords(response);
      setWordList(res.data.msg.words);
      setPointerIndex(0);
      setFirstVisibleCharIndex(0);
      secondLineTopRef.current = null;
    }
    getWords();
  }, [language]);
  const specialKeys = [
    "Tab","Enter","Shift","Ctrl","Alt","Meta","CapsLock","Esc","PageUp","PageDown","End","Home","Left","Up","Right",
    "Down","Delete","Insert","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","ArrowLeft","ArrowRight",
    "ArrowUp","ArrowDown","Control",
  ];
  const getTest = useMemo(() => {
    const response = generateTest({
      mode: selection.mode,
      wordList,
      testWordlength: selection.words,
    });
    // the error is not being toasted. see the error why
    // after that send this uuid and its hash to the backend to generate and compare the strings.

    // the error is not being toasted when the words are undefined because of the type of property here.
    if (typeof response === "string") {
      toast.error(response);
      return <div> Error occurred.</div>;
    }
    setWords(response);
  }, [testWordlength, time, selection.mode]);

  //const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    // if (!timeRef) {
    //   //timeRef =
    // }
    e.preventDefault();
    if (!focus) {
      return;
    } // will see what better i can do here
    const key = e.key;
    let charsSkipped = 1;
    if (specialKeys.includes(key) || e.ctrlKey || e.metaKey) {
      if (e.key != "Backspace" || pointerIndex <= 0) return;

      if (words[pointerIndex - 1].char === " ") {
        let isWordCorrect = true;
        let prevWordPtr = pointerIndex - 2;
        while (prevWordPtr >= 0) {
          if (words[prevWordPtr].status != "correct") {
            isWordCorrect = false;
            break;
          }
          if (words[prevWordPtr].char == " ") {
            break;
          }
          prevWordPtr--;
        }
        if (isWordCorrect) {
          return;
        }
      }
      // ya toh pointerIndex 0 ho jaye ya phir wapas se gap aa jaye
      //char gap ho skta hai agar woman| hello ho toh
      // char-1 bhi gap ho skta hai agar woman |hello ho toh
      // edge case here is that if first letter is one only a| woman

      // if the pointer index is in between of words hel|lo

      // while backing up if the last char is 'extra' then that case should be also handled.
      let pointerCorrection = 0;
      if (words[pointerIndex].char === " ") {
        pointerCorrection = 1;
      } else if (words[pointerIndex - 1].char === " ") {
        pointerCorrection = 2;
      }
      let backIterator = pointerIndex - pointerCorrection;
      while (backIterator > 0) {
        if (words[backIterator].char == " ") {
          backIterator++;
          break;
        }
        backIterator--;
      }
      setWords((prev) => {
        const data = [...prev];
        let pointerIndexCopy = pointerIndex;
        while (pointerIndexCopy != backIterator) {
          if (data[pointerIndexCopy].status !== "extra") {
            data[pointerIndexCopy].status = "pending";
          } else {
            data.splice(pointerIndexCopy, 1);
          }
          pointerIndexCopy--;
        }
        data[pointerIndexCopy].status = "pending"; // specifically for the first char of the word.
        return data;
      });
      setPointerIndex(backIterator);
    }
    //nested if is required here , if i put both the conditions on same level then first letter will get red mark due to first backspace, kinda glitch
    //reason key is backspace but the pointer index is zero so else condition will run and mark the first letter as the incorrect!
    else if (key === "Backspace") {
      // this is to check if the back movement is available?
      if (pointerIndex === 0) return;

      if (words[pointerIndex - 1].char === " ") {
        let isWordCorrect = true;
        let prevWordPtr = pointerIndex - 2;
        while (words[prevWordPtr].char != " " && prevWordPtr > 0) {
          if (words[prevWordPtr].status != "correct") {
            isWordCorrect = false;
            break;
          }
          prevWordPtr--;
        }
        if (isWordCorrect) {
          return;
        }
      }

      if (words[pointerIndex - 1].status === "missed") {
        // this is to move back to the last typed character if the back movement is available
        let backMove = 0;

        backMove = pointerIndex - 1;
        while (backMove > 0 && words[backMove].status === "missed") {
          backMove--;
        }

        backMove++;
        setWords((prev) => {
          const data = [...prev];
          let pointerIndexCopy = pointerIndex;
          while (backMove != pointerIndexCopy) {
            data[pointerIndexCopy].status = "pending";
            pointerIndexCopy--;
          }
          data[pointerIndexCopy].status = "pending";
          return data;
        });
        setPointerIndex(backMove);
        return;
      }

      setWords((prev) => {
        const data = [...prev];
        if (data[pointerIndex - 1].status === "extra") {
          data.splice(pointerIndex - 1, 1);
        } else {
          data[pointerIndex - 1].status = "pending";
        }
        return data;
      });
      setPointerIndex((prev) => prev - 1);
    } else {
      setWords((prev) => {
        const data = [...prev];
        if (key === data[pointerIndex].char) {
          data[pointerIndex].status = "correct";
        } else if (key === " " && data[pointerIndex].char != " ") {
          if (pointerIndex != 0) {
            if (data[pointerIndex - 1].char != " ") {
              let iterator = pointerIndex;
              while (data[iterator].char != " ") {
                data[iterator].status = "missed";
                iterator++;
              }
              data[iterator].status = "missed";
              charsSkipped = iterator + 1 - pointerIndex;
            }
          }
        } else {
          if (data[pointerIndex].char === " ") {
            if (data[pointerIndex - 1].status != "extra") {
              data.splice(pointerIndex, 0, {
                char: key,
                status: "extra",
              });
            }
          } else {
            data[pointerIndex].status = "incorrect";
          }
        }
        return data;
      });
      if (pointerIndex > 0) {
        if (words[pointerIndex - 1].char == " " && key == " ") {
          return;
        } else if (words[pointerIndex - 1].status != "extra" || key == " ") {
          setPointerIndex((prev) => prev + charsSkipped);
        }
      } else {
        key != " " ? setPointerIndex((prev) => prev + charsSkipped) : null;
      }
      charsSkipped = 1;
    }
    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    setBlinking(false);

    focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false);
    }, 10000); // set this to 10000
    blinkTimeoutRef.current = setTimeout(() => {
      setBlinking(true);
    }, 500);
  }

  // this is the sliced part of the original flat index array.
  const visibleChars = useMemo(() => {
    return words.slice(firstVisibleCharIndex);
  }, [words, firstVisibleCharIndex]);

  // Memoize grouping of characters into words to prevent words from breaking across lines
  //this is nested array.
  const wordGroups = useMemo(() => {
    const groups: { char: string; status: string }[][] = [];
    if (visibleChars.length === 0) return groups;

    let currentWord: { char: string; status: string }[] = [];
    visibleChars.forEach((charObj) => {
      currentWord.push(charObj);
      if (charObj.char === " ") {
        groups.push(currentWord);
        currentWord = [];
      }
    });
    if (currentWord.length > 0) groups.push(currentWord);
    return groups;
  }, [visibleChars]);

  if (selection.mode === "time" && pointerIndex > words.length - 100) {
    // this is good because 0.7*words.length will increase exponentially.

    const response = generateTest({
      mode: "time",
      testWordlength: null,
      wordList,
    });
    if (typeof response === "string") {
      toast.error("Something went wrong.");
      return;
    }
    numberOfGenerations.current++;
    setWords((prev) => [...prev, ...response]);
  }
  // // Add this state to your component
  // const [isSimulating, setIsSimulating] = useState(true); // Set to true to start
  //     // Add this useEffect to your component
  // useEffect(() => {
  //     // Don't run the simulation if it's not enabled or the test is over
  //     if (!isSimulating || pointerIndex >= words.length) {
  //         return;
  //     }

  //     const intervalId = setInterval(() => {
  //         // Correct, immutable state update for the words array
  //         setWords(prevWords => {
  //             // Create a new array to avoid direct mutation
  //             const newWords = [...prevWords];
  //             // Ensure the character at the pointer exists before trying to update it
  //             if (newWords[pointerIndex]) {
  //                  // Create a new object for the character being changed
  //                 newWords[pointerIndex] = { ...newWords[pointerIndex], status: 'correct' };
  //             }
  //             return newWords;
  //         });

  //         // Correct state update for the pointer
  //         setPointerIndex(prevIndex => prevIndex + 1);

  //     }, 10); // Changed to 200ms for a more visible typing speed

  //     // Cleanup function: This is crucial!
  //     // It runs when the component unmounts or when dependencies change.
  //     return () => {
  //         clearInterval(intervalId);
  //     };
  // }, [isSimulating, pointerIndex, words.length]); // Rerun effect if these change
  function ClickToFocus() {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      setBlinking(false);
      SetFocus(false);
    }, 10000); // set this to 10000

    SetFocus(true);
    setBlinking(true);
  }
  return (
    <div
      ref={containerRef}
      className="h-fit w-[85%] p-5 relative focus:outline-none flex items-center justify-center overflow-hidden"
      onBlur={() => {
        SetFocus(false);
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={ClickToFocus} // moved from line 457 to here
    >
      <div
        ref={textFlowAreaRef}
        className="text-flow-area flex flex-wrap gap-x-0.5 leading-14 text-[33px] relative h-40 px-2 w-full outline outline-gray-400"
      >
        <div
          className={`absolute bottom-0 w-full h-full backdrop-blur-xs ${
            !focus ? "opacity-100" : "opacity-0 pointer-events-none"
          } origin-center flex transition-all duration-300 ease-out items-center justify-center text-gray-500 z-10`}
        >
          Click here to focus ^_^
        </div>
          <div
      className="h-full w-full overflow-y-hidden overflow-x-hidden flex flex-wrap gap-x-0.5 leading-14 text-[33px]">
        {wordGroups.map((word, wordIndex) => {
          let charOffset = 0;
          for (let i = 0; i < wordIndex; i++) {
            charOffset += wordGroups[i].length;
          }

          return (
            <span
              key={`word-${wordIndex}`}
              className="inline-block whitespace-pre"
            >
              {word.map((value, charIndex) => {
                const localIndex = charOffset + charIndex;
                const globalIndex = firstVisibleCharIndex + localIndex;
                const status = value.status;
                const char = value.char;
                return (
                  <span
                    ref={pointerIndex === globalIndex ? currentWordRef : null}
                    key={`char-${globalIndex}`}
                    className={`${CHAR_SPAN_CLASS} ${
                      status === "pending"
                        ? "text-gray-400"
                        : status === "correct"
                        ? "text-green-400"
                        : status === "missed"
                        ? char !== " "
                          ? "text-gray-400 border-b-2  border-red-500"
                          : null
                        : "text-red-500 border-b-2  border-red-500" // incorrect and extra
                    }`}
                  >
                    {value.char}
                  </span>
                );
              })}
            </span>
          );
        })}
        </div>
      </div>
      <div
        ref={cursorElementRef}
        id="cursor"
        className={` absolute top-0 left-0 w-0.5 bg-amber-500
            
                    ${
                      blinking
                        ? "cursor animate-blink"
                        : "transition-transform duration-150 ease-out "
                    }
                    ${!focus && "bg-transparent"}
                    w-0.5 z-0`}
        style={{ transform: "translateX(0px)" }} // Initial position is handled by transform
      />
    </div>
  );
}
