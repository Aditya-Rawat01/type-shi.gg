import { useAtom, useSetAtom } from "jotai";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { modeAtom } from "@/app/store/atoms/mode";
import { memo, MouseEvent, useEffect, useState } from "react";
import { LanguagesIcon } from "lucide-react";
import { shouldFetchLanguageAtom } from "@/app/store/atoms/shouldFetchLang";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; 
import {motion} from 'motion/react'
type languageType = "English" | "English1k" | "C" | "C++" | "French" | "French1k" | "Italian" | "Italian1k" | "Java" | "Javascript" | "Php" | "Portuguese" | "Portuguese1k" | "Ruby" | "Russian" | "Russian1k" | "Spanish" | "Spanish1k" | "Typescript"

const LanguageSelector=memo(()=>{
    const [mode, setMode] = useAtom(modeAtom)
    const [open, setOpen] = useState(false)
    const setChangeLanguage = useSetAtom(shouldFetchLanguageAtom)
    const [visibleLang, setVisibleLang] = useState(mode.language);
    const languages:languageType[] = ['English', 'English1k', 'French' ,'French1k','Italian','Italian1k' ,'Portuguese','Portuguese1k','Russian','Russian1k','Spanish','Spanish1k','C','C++','Java','Javascript','Php','Ruby','Typescript'];
    function changeLanguage(lang:languageType,e:MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        mode.language!==lang?setMode((prev)=>({...prev, language:lang })):null
        mode.language!==lang?setChangeLanguage(true):null 
        //setOpen(false)
    }
    useEffect(() => {
    const timeout = setTimeout(() => {
      setVisibleLang(mode.language);
    }, 250); // 0.2s delay

    return () => clearTimeout(timeout); // cleanup on rapid changes
  }, [mode.language]);
    return (
    <Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger className="cursor-pointer flex gap-2 p-3 w-48 items-end justify-center">
    <p><LanguagesIcon /></p>
    <p>{visibleLang}</p>
    </SheetTrigger>
  <SheetContent>
    <SheetHeader className="px-3 py-3 overflow-auto">
      <VisuallyHidden><SheetTitle>Languages</SheetTitle></VisuallyHidden>
      <SheetDescription className="text-[var(--text)] w-full flex flex-col gap-2">
        {languages.map((language, index)=>(
          <span className="w-full" key={index}>
            {index===0 && <span className="block p-4 w-full">----Languages----</span>}
            {index===12 && <span className="block p-4 w-full">----Coding Languages----</span>}
            <button className="w-full p-3 text-lg hover:bg-[var(--backgroundSecondary)] bg-black/10 rounded-xl cursor-pointer" onClick={(e)=>changeLanguage(language,e)}>{language}</button>
          </span>
        ))}
      </SheetDescription>
    </SheetHeader>
   
  </SheetContent>
</Sheet>
    )})

export default LanguageSelector