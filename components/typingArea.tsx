"use client";

import {
  Dispatch,
  KeyboardEvent,
  memo,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { URI } from "@/lib/URI";
import generateTest from "@/lib/seed-Generation";
import { toast } from "sonner";
import "../app/page.css";
import { modeAtom } from "@/app/store/atoms/mode";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { LanguagesIcon, Lock, RefreshCw, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  persistWordListAtom,
  restartSameTestAtom,
  shadowTestAtom,
} from "@/app/store/atoms/restartSameTest";
import { shouldFetchLanguageAtom } from "@/app/store/atoms/shouldFetchLang";
import { cumulativeIntervalAtom } from "@/app/store/atoms/cumulativeIntervals";
import { afkAtom } from "@/app/store/atoms/afkModeAtom";
import LanguageSelector from "./languageSelector";
import { hashAtom } from "@/app/store/atoms/generatedHash";
import { selectionPanelVisibleAtom } from "@/app/store/atoms/selectionPanelVisibility";
import { themeAtom } from "@/app/store/atoms/theme";
const CHAR_SPAN_CLASS = "char-element";
export default function TypingArea({
  setShowResultPage,
  setCharArray,
  LoadingConfig,
  keyPressDuration,
  currentkeysPressed,
  keySpaceDuration,
  currentKeySpace,
}: {
  setShowResultPage: Dispatch<SetStateAction<boolean>>;
  setCharArray: Dispatch<SetStateAction<number[]>>;
  LoadingConfig: boolean;
  keyPressDuration: RefObject<number[]>;
  currentkeysPressed: RefObject<{
    [key: string]: number;
  }>;
  keySpaceDuration: RefObject<number[]>;
  currentKeySpace: RefObject<number>;
}) {
  const [words, setWords] = useState<
    {
      char: string;
      status: string;
    }[]
  >([]);
  const wordsRef = useRef<
    {
      char: string;
      status: string;
    }[]
  >([]); // just because request animation frame closure gets stale in time mode so ref keep that in sync
  const [wordListFromBackend, setwordListFromBackend] =
    useAtom(persistWordListAtom);
  //const mode:"words"|"time" = 'time' // have to be set by maybe cookies or something else like localstorage.
  const selection = useAtomValue(modeAtom);
  const [repeatTest, setRepeatTest] = useAtom(restartSameTestAtom);
  const [shadowTest, setShadowTest] = useAtom(shadowTestAtom);
  const [shouldFetchLang, setShouldFetchLang] = useAtom(
    shouldFetchLanguageAtom
  );
  const [hash, setHash] = useAtom(hashAtom);
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
  const textFlowAreaRef = useRef<HTMLDivElement>(null); // for the container
  const cursorAnimationRef = useRef<number | null>(0);
  const [isRefreshed, setIsRefreshed] = useState<number>(0);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  //const [refresh, setRefreshed] = useState(false);
  const [capsKey, setCapsKey] = useState(false);
  const isMounted = useRef(false);
  const wordsTypedInSec = useRef(0);
  const [showResultLoading, setShowResultLoading] = useState(false);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);
  const ArrayOnIntervals = useRef<
    {
      wpm: number;
      rawWpm: number;
      interval: number;
      errors: number;
      problematicKeys: string[];
    }[]
  >([]);
  const setCumulativeIntervaltom = useSetAtom(cumulativeIntervalAtom);
  const [isTestActive, setIsTestActive] = useState(false);
  const intervalForSec = useRef<number | null>(null);
  const pointerIndexCopyRef = useRef(0); // clever workaround so that useEffect dont run again and again.
  const testStartTiming = useRef(Date.now());
  const [timer, setTimer] = useState(0);
  const timeShadowRef = useRef(0);
  const totalTimePassed = useRef(0);
  const isAlreadyCalculatingResult = useRef(false);
  const errorsInterval = useRef<
    {
      errors: number;
      timer: number;
      diffKeys: { correctKey: string; incorrectKey: string }[];
    }[]
  >([]);
  const currentWordRef = useRef(0); // not setting this to zero, lets see what happens
  const afkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setAfkMode = useSetAtom(afkAtom);
  const [selectionPanelVisible, setSelectionPanelVisible] = useAtom(
    selectionPanelVisibleAtom
  );
  const [themeColor,setThemeColor] = useAtom(themeAtom)

  const themeColorsAtBuildTime = {            // tailwind doesnt understand the dynamic values easily. // mapping because said in documentation
    surface:themeColor.surface,
    background:themeColor.background,
    backgroundSecondary:themeColor.backgroundSecondary,
    surfaceSecondary:themeColor.surfaceSecondary,
    miscellaneous:themeColor.miscellaneous,
    text:themeColor.text
  }





  const framesRef = useRef<{
    correct: number;
    incorrect: number;
    missed: number;
    extra: number;
    errors: number;
    correctKeyErrors: string[];
  }>({
    correct: 0,
    incorrect: 0,
    missed: 0,
    extra: 0,
    errors: 0,
    correctKeyErrors: [],
  });
  useEffect(()=>{
    function windowKeyDown(e:globalThis.KeyboardEvent) {
      if (focus) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      const key = e.key
      const specialkeysWithoutCapsLock = specialKeys.reduce<string[]>((acc, curr)=>{ 
        if (curr!="CapsLock") {
          acc.push(curr)
        }
        return acc
      },[])
      if (specialkeysWithoutCapsLock.includes(key)) {
        return
      }
      const isActive = e.getModifierState("CapsLock");
      if (key==="CapsLock") {
         setCapsKey(isActive)
      } else {
        SetFocus(true)
        setBlinking(true)
        containerRef.current?.focus();
        if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
        focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false);
    }, 10000); 
      }

    }
    window.addEventListener('keydown',windowKeyDown)
    return ()=>{
    // one smol problem is that now every time focus changed , previous listener is removed and new one is added.
    // as the useEffect will not remember the focus state if not put in the deps array, so this is ok as it doesnt
    // culminate many listeners together.
    window.removeEventListener('keydown',windowKeyDown)
    }
  },[focus])
  useEffect(() => {
    wordsRef.current = words; // to keep ref in syn for request animation frame
  }, [words]);

  useEffect(() => {
    if (!isTestActive) {
      keyPressDuration.current = [];
      currentkeysPressed.current = {};
      keySpaceDuration.current = [];
      currentKeySpace.current = 0;

      // stop timer
      setTimer(0);
      if (afkTimeoutRef.current) {
        clearTimeout(afkTimeoutRef.current);
      }
      framesRef.current = {
        correct: 0,
        incorrect: 0,
        missed: 0,
        extra: 0,
        errors: 0,
        correctKeyErrors: [],
      };
      setCharArray([0, 0, 0, 0]);
      setAfkMode(false);
      setCumulativeIntervaltom([]);
      setHash({ GeneratedAmt: 0, hash: "", originalSeed: "" }); // just to be safe.(redundant)
      timeShadowRef.current = 0;
      totalTimePassed.current = 0;
      errorsInterval.current = [];
      ArrayOnIntervals.current = [];
      isAlreadyCalculatingResult.current = false;
      if (intervalForSec.current !== null) {
        cancelAnimationFrame(intervalForSec.current);
        intervalForSec.current = null;
      }
      return;
    }

    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
    ArrayOnIntervals.current = [];
    wordsTypedInSec.current = 0;
    testStartTiming.current = performance.now();
    console.log(testStartTiming.current);
    console.log("the test starts now");
    intervalForSec.current = requestAnimationFrame(
      callBackRequestAnimationFrame
    );

    return () => {
      if (intervalForSec.current) {
        cancelAnimationFrame(intervalForSec.current);
      }
    };
  }, [isTestActive]); // due to pointerIndexCopyRef being a ref which means this is object, checked by reference so useEffect closure will contain
  // the latest value despite of not being given in the dep array.
  // i want to use the updated pointerIndex value but giving it inside the state will cause useEffect reruns again and again
  useEffect(() => {
    containerRef.current?.focus();
    // as soon as the page mounts (code duplication here,  will be applied/run only once)
    focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false);
    }, 10000); 

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (afkTimeoutRef.current) {
        clearTimeout(afkTimeoutRef.current);
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
        requestAnimationFrame(() => {
          // better approach as it fixes any resize problems but the tradeoff is that as we resize the current char becomes the first char.
          let newFirstVisibleCharIndex = pointerIndex; // Start by assuming pointerIndex is now first
          if (pointerIndex < words.length && pointerIndex >= 0) {
            let wordStart = pointerIndex;
            if (words[wordStart]?.char === " " && wordStart > 0) wordStart--; // If on space, look at char before
            while (wordStart > 0 && words[wordStart - 1]?.char !== " ") {
              wordStart--;
            }
            newFirstVisibleCharIndex = wordStart;
          }
          newFirstVisibleCharIndex = Math.max(
            0,
            Math.min(newFirstVisibleCharIndex, words.length - 1)
          );
          if (Math.abs(newFirstVisibleCharIndex - firstVisibleCharIndex) > 0) {
            setFirstVisibleCharIndex(newFirstVisibleCharIndex);
            return;
          }
        });

        CachedFnToHandleMouseMovement();
      }, 500);
    };
    window.addEventListener("resize", resizeFn);
    return () => window.removeEventListener("resize", resizeFn);
  }, [CachedFnToHandleMouseMovement]);

  // responsible only to get the langauge from the backend
  useEffect(() => {
    if (!selectionPanelVisible) {
      setSelectionPanelVisible(true);
    }
    if (repeatTest) {
      console.log("dhould not be here");
      const newRef = shadowTest.map((prev) => ({ ...prev }));
      setWords(newRef);
      //setRestartSameTest(false) // redundant tho.  , keep it true so that repeated flag could be shown.
      return;
    }
    if (!shouldFetchLang) {
      setIsRefreshed(performance.now()); // so that the below useEffect run and generate the words array. running that function here means increment in dep array.
      // is refreshed is not in the dep array so this value exists for this closure only
      return;
    }
    async function getWords() {
      // problem here is that this is also runniing on mount,
      // on first point we want it to run when the selection.language doesnt change.
      // but when the language is same then this should not run
      // on mount run only for first time, then selection.language dekh ke run kro.
      try {
        const res = await axios.get(
          `${URI}/api/language/${selection.language}`
        );
        setwordListFromBackend(res.data.msg.words);
        if (wordListFromBackend.length !== 0) {
          toast.success("Language updated (👉ﾟヮﾟ)👉");
        }
      } catch (error) {
        setwordListFromBackend([]);
        toast.error("Error while fetching languages.");
        console.log(error);
      }
      setShouldFetchLang(false);
    }
    getWords();
  }, [selection.language, shouldFetchLang]);
  // responsible to set the states when the backend sends the language on mounting
  useEffect(() => {
    // refresh tes runs again
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }
    if (wordListFromBackend.length == 0) {
      return;
    }
    //setRefreshed(true)
    refreshTimeout.current = setTimeout(
      () => {
        const response = generateTest({
          mode: selection.mode,
          wordList: wordListFromBackend, // this is the culprit, the first useEffect is just setting the wordList to the backend sent list
          // so this line contains no words just an empty array which returns empty strings.
          testWordlength: selection.words,
          numbers:selection.numbers,
          punctuation:selection.punctuation
        });

        if (typeof response === "string") {
          toast.error(response);
          return;
        }
        setWords(response.characters);
        setHash({
          hash: response.generatedHash,
          GeneratedAmt: 1,
          originalSeed: response.originalSeed!,
        }); //this is the only place where original seed should be updated.
        const newRef = response.characters.map((prev) => ({ ...prev })); // to create a new reference to obj otherwise both shadowtest and words will contain same reference so if words update then shadowtest too.
        setShadowTest(newRef);
        setFirstVisibleCharIndex(0);
        secondLineTopRef.current = null;
        setRepeatTest(false);
        numberOfGenerations.current = 1;
        currentWordRef.current = 0;
        setPointerIndex(0);
        setIsTestActive(false);
        containerRef.current?.focus();
        //setRefreshed(false)
      },
      isRefreshed ? 80 : 400
    );
  }, [selection, isRefreshed, wordListFromBackend]);

  function callBackRequestAnimationFrame() {
    const currentTime = performance.now();
    const elapsedMilliseconds = currentTime - testStartTiming.current;
    const currentTotalFullSecond = Math.floor(elapsedMilliseconds / 1000);

    // to check if 1 sec has passed from when previous setInterval fired off

    for (
      let i = wordsTypedInSec.current;
      i < pointerIndexCopyRef.current;
      i++
    ) {
      const status = wordsRef.current[i].status;
      switch (status) {
        case "correct":
          framesRef.current.correct++;
          break;
        case "incorrect":
          framesRef.current.incorrect++;
          framesRef.current.errors++;
          framesRef.current.correctKeyErrors.push(wordsRef.current[i].char===" "?"spacekey":wordsRef.current[i].char);
          break;
        case "missed":
          framesRef.current.missed++;
          framesRef.current.errors++;
          framesRef.current.correctKeyErrors.push(wordsRef.current[i].char===" "?"spacekey":wordsRef.current[i].char);
          break;
        default:
          framesRef.current.extra++;
          framesRef.current.errors++;
          console.log(i);
          framesRef.current.correctKeyErrors.push("spacekey");
      }
    }
    wordsTypedInSec.current = pointerIndexCopyRef.current;
    if (
      currentTotalFullSecond >= 1 &&
      currentTotalFullSecond > totalTimePassed.current
    ) {
      const totalCharsInSec =
        framesRef.current.correct +
        framesRef.current.incorrect +
        framesRef.current.extra +
        framesRef.current.missed;
      // as 60/5 = 12 // divided by 5 because chars to words and 5 is mere approximation
      const correctCharsInSec = framesRef.current.correct;
      totalCharsRef.current += totalCharsInSec;
      correctCharsRef.current += correctCharsInSec;
      //const errorInSec = totalCharsInSec-correctCharsInSec
      const interval = Math.round(
        (currentTime - testStartTiming.current) / 1000
      );
      if (!interval) return; // if interval is 0 // redundant
      const cumulatedRawWpm = (totalCharsRef.current * 12) / interval; // to convert the interval from ms to seconds.
      const cumulatedWpm = (correctCharsRef.current * 12) / interval;
      totalTimePassed.current = interval;
      ArrayOnIntervals.current.push({
        rawWpm: cumulatedRawWpm,
        wpm: cumulatedWpm,
        interval: interval,
        errors: framesRef.current.errors,
        problematicKeys: [...framesRef.current.correctKeyErrors],
      });

      framesRef.current = {
        correct: 0,
        incorrect: 0,
        missed: 0,
        extra: 0,
        errors: 0,
        correctKeyErrors: [],
      };

      if (selection.mode === "time") {
        timeShadowRef.current++;
        setTimer(timeShadowRef.current);
      }
    }
    if (
      selection.mode === "time" &&
      timeShadowRef.current === selection.time &&
      !isAlreadyCalculatingResult.current
    ) {
      calculateResult(""); // just give random key , will not matter as the mode is time.
      isAlreadyCalculatingResult.current = true;
    }
    intervalForSec.current = requestAnimationFrame(
      callBackRequestAnimationFrame
    ); // recursion.
  }
  const specialKeys = [
    "Tab",
    "Enter",
    "Shift",
    "Ctrl",
    "Alt",
    "Meta",
    "CapsLock",
    "Esc",
    "PageUp",
    "PageDown",
    "End",
    "Home",
    "Left",
    "Up",
    "Right",
    "Down",
    "Delete",
    "Insert",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Control",
  ];
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

  if (showResultLoading) {
    return <ResultLoadingPlaceholder />;
  }
  //const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function calculateResult(key: string) {
    //setShowResultLoading(true)
    const hasRemaining =
      framesRef.current.correct > 0 ||
      framesRef.current.incorrect > 0 ||
      framesRef.current.missed > 0 ||
      framesRef.current.extra > 0;

    if (hasRemaining) {
      const totalCharsInSec =
        framesRef.current.correct +
        framesRef.current.incorrect +
        framesRef.current.extra +
        framesRef.current.missed;

      const correctCharsInSec = framesRef.current.correct;
      totalCharsRef.current += totalCharsInSec;
      correctCharsRef.current += correctCharsInSec;
      const interval = Math.round(
        (performance.now() - testStartTiming.current) / 1000
      );

      const cumulatedRawWpm = (totalCharsRef.current * 12) / interval;
      const cumulatedWpm = (correctCharsRef.current * 12) / interval;
      const originalArray =
        ArrayOnIntervals.current[ArrayOnIntervals.current.length - 1];
      originalArray.errors += framesRef.current.errors;
      originalArray.problematicKeys = [
        ...originalArray.problematicKeys,
        ...framesRef.current.correctKeyErrors,
      ];
      originalArray.rawWpm = cumulatedRawWpm;
      originalArray.wpm = cumulatedWpm;

      // Reset frames to prevent duplicate pushing
      framesRef.current = {
        correct: 0,
        incorrect: 0,
        missed: 0,
        extra: 0,
        errors: 0,
        correctKeyErrors: [],
      };
    }
    const charArray = [0, 0, 0, 0]; // correct, incorrect, missed, extra
    for (let i = 0; i < words.length; i++) {
      let currentindex = words[i];
      if (currentindex.status === "pending" && selection.mode === "time") {
        break;
      }
      if (currentindex.char != " ") {
        if (currentindex.status === "correct") {
          charArray[0]++;
        } else if (currentindex.status === "incorrect") {
          charArray[1]++;
        } else if (currentindex.status === "missed") {
          charArray[2]++;
        } else if (currentindex.status === "extra") {
          charArray[3]++;
        } else {
          // run when the pointerIndex reaches to the last char.
          if (key === words[words.length - 1].char) {
            charArray[0]++;
          } else {
            charArray[2]++;
          }
        }
      }
    }
    console.log(ArrayOnIntervals);
    setCumulativeIntervaltom(ArrayOnIntervals.current);
    setCharArray(charArray);
    setShowResultPage(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    // if (!timeRef) {
    //   //timeRef =
    // }
    const key = e.key;
    if (isTestActive && !e.repeat && !currentkeysPressed.current[key]) {
      currentkeysPressed.current[key] = performance.now(); // this handles the key pressing time
    }
    if (isTestActive && !e.repeat) {
      // this handles the cadence.
      if (!currentKeySpace.current) {
        currentKeySpace.current = performance.now();
      } else {
        const currentTime = performance.now();
        const space = currentTime - currentKeySpace.current;
        currentKeySpace.current = currentTime;
        keySpaceDuration.current.push(space);
      }
    }
    if (!LoadingConfig) return;
    e.preventDefault();
    if (!focus) {
      return;
    } // will see what better i can do here

    let charsSkipped = 1;

    const isActive = e.getModifierState("CapsLock");
    if (
      selectionPanelVisible &&
      !specialKeys.includes(key) &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.metaKey
    ) {
      setSelectionPanelVisible(false);
    }
    if ((isActive || capsKey) && key === "CapsLock") {
      setCapsKey(isActive);
    }
    if (
      capsKey &&
      key >= "a" &&
      key <= "z" &&
      key != "Backspace" &&
      !specialKeys.includes(key) &&
      !e.shiftKey
    ) {
      setCapsKey(false);
    } else if (
      !capsKey &&
      key >= "A" &&
      key <= "Z" &&
      key != "Backspace" &&
      !specialKeys.includes(key) &&
      !e.shiftKey
    ) {
      setCapsKey(true);
    }
    if (isAlreadyCalculatingResult.current) {
      return;
    }
    if (
      pointerIndex === words.length - 1 &&
      !specialKeys.includes(key) &&
      key != "Backspace"
    ) {
      isAlreadyCalculatingResult.current = true;
      calculateResult(key);
      return;
    }
    if (specialKeys.includes(key) || e.ctrlKey || e.metaKey) {
      if (e.key != "Backspace" || pointerIndex <= 0) return;

      if (words[pointerIndex - 1].char === " ") {
        let isWordCorrect = true;
        let prevWordPtr = pointerIndex - 2;
        while (prevWordPtr >= 0) {
          if (words[prevWordPtr].char == " ") {
            break;
          }
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
      words[pointerIndex].char != " " && currentWordRef.current > 0
        ? currentWordRef.current--
        : null; // as the ctrl + backspace will always decrease one word
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
      pointerIndexCopyRef.current = backIterator;
    }
    //nested if is required here , if i put both the conditions on same level then first letter will get red mark due to first backspace, kinda glitch
    //reason key is backspace but the pointer index is zero so else condition will run and mark the first letter as the incorrect!
    else if (key === "Backspace") {
      // this is to check if the back movement is available?
      if (pointerIndex === 0) return;

      if (words[pointerIndex - 1].char === " ") {
        let isWordCorrect = true;
        let prevWordPtr = pointerIndex - 2;
        while (words[prevWordPtr].char != " " && prevWordPtr >= 0) {
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
        pointerIndexCopyRef.current = backMove;
        words[pointerIndex - 1].char === " " && currentWordRef.current > 0
          ? currentWordRef.current--
          : null;
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
      pointerIndexCopyRef.current -= 1;
      words[pointerIndex - 1].char === " " && currentWordRef.current > 0
        ? currentWordRef.current--
        : null;
    } else {
      let errors = 0;
      let diffKeys: { correctKey: string; incorrectKey: string }[] = [];
      const data = [...words];
      if (key === data[pointerIndex].char) {
        data[pointerIndex].status = "correct";
      } else if (key === " " && data[pointerIndex].char != " ") {
        if (pointerIndex != 0) {
          if (data[pointerIndex - 1].char != " ") {
            let iterator = pointerIndex;
            while (data[iterator].char != " ") {
              data[iterator].status = "missed";
              iterator++;
              diffKeys.push({
                correctKey: data[iterator].char,
                incorrectKey: "SpaceKey",
              });
              errors++;
              if (iterator === words.length) {
                errorsInterval.current.push({
                  errors: errors,
                  diffKeys: diffKeys,
                  timer: timer,
                });
                setWords(data);
                calculateResult(key); // as the last key typed in this scenario will be this =" "
                return;
              }
            }
            errorsInterval.current.push({
              errors: errors,
              diffKeys: diffKeys,
              timer: timer,
            });
            data[iterator].status = "missed";
            charsSkipped = iterator + 1 - pointerIndex;
            currentWordRef.current++;
          }
        }
      } else {
        if (data[pointerIndex].char === " ") {
          if (data[pointerIndex - 1].status != "extra") {
            data.splice(pointerIndex, 0, {
              char: key,
              status: "extra",
            });
            diffKeys.push({
              correctKey: "SpaceKey",
              incorrectKey: key,
            });
            errorsInterval.current.push({
              errors: 1,
              diffKeys: diffKeys,
              timer: timer,
            });
          }
        } else {
          data[pointerIndex].status = "incorrect";
          diffKeys.push({
            correctKey: data[pointerIndex].char,
            incorrectKey: key,
          });
          errorsInterval.current.push({
            errors: 1,
            diffKeys: diffKeys,
            timer: timer,
          });
        }
      }

      setWords(data);
      if (pointerIndex > 0) {
        if (words[pointerIndex - 1].char == " " && key == " ") {
          currentWordRef.current++;
          return;
        } else if (words[pointerIndex - 1].status != "extra" || key == " ") {
          setPointerIndex(pointerIndex + charsSkipped);
          pointerIndexCopyRef.current = pointerIndex + charsSkipped;
        }
      } else {
        if (key != " ") {
          setPointerIndex((prev) => prev + charsSkipped);
          pointerIndexCopyRef.current = pointerIndex + charsSkipped;
        } // this is for normal typing
      }
      charsSkipped = 1;
      if (key === " " && words[pointerIndex].char === key) {
        // will not hit in the case of missed words.
        currentWordRef.current++;
      }
    }
    if (!isTestActive && pointerIndexCopyRef.current > 0) {
      setIsTestActive(true);
    }

    if (blinkTimeoutRef.current) {
      clearTimeout(blinkTimeoutRef.current);
    }
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    if (afkTimeoutRef.current) {
      clearTimeout(afkTimeoutRef.current);
    }
    setBlinking(false);

    focusTimeoutRef.current = setTimeout(() => {
      SetFocus(false);
    }, 10000); // set this to 10000
    afkTimeoutRef.current = setTimeout(() => {
      setAfkMode(true);
      setShowResultPage(true);
    }, 20000);
    blinkTimeoutRef.current = setTimeout(() => {
      setBlinking(true);
    }, 500);
  }

  function handleKeyUp(e: KeyboardEvent<HTMLSpanElement>) {
    // pressing duration.
    if (e.repeat) return;
    const key = e.key;
    const startTime = currentkeysPressed.current[key];
    if (startTime) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      keyPressDuration.current.push(duration);
      delete currentkeysPressed.current[key];
    }
  }
  //// when the pointerIndex becomes greater than 0 then start the clock thats it.
  /// later on detect the afk here as well.
  // firstly i will calculate that for each sec what is the current wpm is for the user that will be used for the line chart then after on.

  if (
    selection.mode === "time" &&
    pointerIndex > words.length - 100 &&
    isTestActive
  ) {
    // this is good because 0.7*words.length will increase exponentially.
    const response = generateTest({
      mode: "time",
      testWordlength: null,
      wordList: wordListFromBackend,
      seed: hash.hash,
      numbers:selection.numbers,
      punctuation:selection.punctuation
    });
    if (typeof response === "string") {
      toast.error("Something went wrong.");
      return;
    }
    numberOfGenerations.current++;
    console.log({ words, newArr: response.characters });
    setWords((prev) => [...prev, ...response.characters]);
    console.log(shadowTest);
    setHash({
      GeneratedAmt: hash.GeneratedAmt + 1,
      originalSeed: hash.originalSeed,
      hash: response.generatedHash,
    });
    console.log({ amt: hash.GeneratedAmt + 1 });
    const newRef = response.characters.map((prev) => ({ ...prev }));
    setShadowTest((prev) => [...prev, ...newRef]);
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
    //       if (pointerIndex===words.length-1) {
    //         calculateResult("w")
    //         return
    //       }
    //         // Correct, immutable state update for the words array
    //         setWords(prevWords => {
    //             // Create a new array to avoid direct mutation
    //             const newWords = [...prevWords];
    //             // Ensure the character at the pointer exists before trying to update it
    //             if (newWords[pointerIndex]) {
    //                 // Create a new object for the character being changed
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

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as HTMLElement | null; // the element that’s about to get focus
    const selectionPanelId = "focusStaysActive"
     if (!e.currentTarget.contains(next) && (next === null || next.id !== selectionPanelId)) {
    SetFocus(false); 
  }};

  return (
    <motion.div
      variants={{
        animate: { opacity: 0.8 },
        default: { opacity: 1 },
      }}
      //here is the thing
      key={selection.mode + selection.numbers + selection.punctuation + selection.time + selection.words + isRefreshed}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      transition={{
        ease: "easeIn",
        type: "spring",
        damping: 50, // ↓ damping → bouncier
        stiffness: 20, // ↑ stiffness → faster
        mass: 1.5,
        duration: 0.7,
      }}
    >
      <div
        ref={containerRef}
        className={`h-fit w-full p-5 relative focus:outline-none flex flex-col items-center justify-center overflow-hidden`}
        onBlur={handleContainerBlur}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={ClickToFocus} // moved from line 457 to here
        onMouseMove={() => {
          !selectionPanelVisible ? setSelectionPanelVisible(true) : null;
        }}
      >
        <div
          className={`p-3 w-fit h-fit  gap-3 top-2 absolute bg-yellow-400 rounded-2xl z-20 ${
            capsKey ? "flex" : "hidden"
          }`}
        >
          <Lock />
          <p>Caps Lock On</p>
        </div>
        <div className={`h-fit w-fit p-1 flex items-center justify-center text-3xl`}>
          {selection.mode === "time" ? (
            <p>{(selection.time - timer).toString()}</p>
          ) : (
            <p>
              {currentWordRef.current.toString() +
                "/" +
                selection.words.toString()}
            </p>
          )}
        </div>
        <div
          className={` w-full flex items-end justify-center relative gap-3 h-fit border border-red-400 rounded-2xl`}
        >        

          <RepeatedTestIndicator repeatTest={true}/>

          <div className="flex gap-2 p-2 rounded-xl">
            <LanguageSelector />
          </div>
        </div>
        {/* will show the total words typed or the time passing */}
        <div
          ref={textFlowAreaRef}
          className="text-flow-area flex flex-wrap gap-x-0.5 leading-14 text-[33px] relative h-40 mb-5  w-[85%]"
        >
          <div
            className={`absolute bottom-0 w-full h-full backdrop-blur-xs ${
              !focus ? "opacity-100" : "opacity-0 pointer-events-none"
            } origin-center flex transition-all duration-300 ease-out items-center justify-center text-gray-500 z-10`}
          >
            Click here to focus ^_^
          </div>

          <div
            className={`h-full w-full px-2 overflow-y-hidden overflow-x-hidden flex flex-wrap gap-x-0.5 leading-14 text-[33px] transition-all ease-out duration-[400ms]`}
          >
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
        {words.length > 0 && (
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
        )}
        <RefreshIcon setIsRefreshed={setIsRefreshed} />
      </div>
    </motion.div>
  );
}

function ResultLoadingPlaceholder() {
  return <div className="bg-white"> Loading results, please wait...</div>;
}

//memoizing icons to reduce their re-renders
const RefreshIcon = memo(
  ({
    setIsRefreshed,
  }: {
    setIsRefreshed: Dispatch<SetStateAction<number>>;
  }) => {
    console.log("here");
    return (
      <Tooltip>
        <TooltipTrigger>
          <RefreshCw
            className={`cursor-pointer transition-all ease-out duration-[400ms]`}
            onClick={() => {
              setIsRefreshed(Date.now());
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Restart Test</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);



const RepeatedTestIndicator = memo(({repeatTest}:{repeatTest:boolean})=>(
  <div
            className={`flex gap-2 p-2 rounded-xl transition-opacity duration-200 ease-out ${
              repeatTest ? "opacity-100" : "opacity-0 pointer-events-none"
            } absolute mr-80`}
          >
            <RotateCcw />
            <p className="text-red-500">Repeated</p>
          </div>
))