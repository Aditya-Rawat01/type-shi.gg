import { useAtom, useSetAtom } from "jotai";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { modeAtom } from "@/app/store/atoms/mode";
import { memo, MouseEvent, useState } from "react";
import { LanguagesIcon } from "lucide-react";
import { shouldFetchLanguageAtom } from "@/app/store/atoms/shouldFetchLang";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; 

type languageType = "English" | "English1k" | "C" | "C++" | "French" | "French1k" | "Italian" | "Italian1k" | "Java" | "Javascript" | "Php" | "Portuguese" | "Portuguese1k" | "Ruby" | "Russian" | "Russian1k" | "Spanish" | "Spanish1k" | "Typescript"

const LanguageSelector=memo(()=>{
    const [mode, setMode] = useAtom(modeAtom)
    const [open, setOpen] = useState(false)
    const setChangeLanguage = useSetAtom(shouldFetchLanguageAtom)
    const languages:languageType[] = ['English', 'English1k', 'French' ,'French1k','Italian','Italian1k' ,'Portuguese','Portuguese1k','Russian','Russian1k','Spanish','Spanish1k','C','C++','Java','Javascript','Php','Ruby','Typescript'];
    function changeLanguage(lang:languageType,e:MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        mode.language!==lang?setMode((prev)=>({...prev, language:lang })):null
        mode.language!==lang?setChangeLanguage(true):null 
        //setOpen(false)
    }
    return (
    <Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger className="flex gap-2 cursor-pointer">
    <p><LanguagesIcon /></p>
    <p>{mode.language}</p>
    </SheetTrigger>
  <SheetContent>
    <SheetHeader className="px-0 py-0 overflow-auto">
      <VisuallyHidden><SheetTitle>Languages</SheetTitle></VisuallyHidden>
      <SheetDescription className="bg-green-400 w-full flex flex-col">
        {languages.map((language, index)=>(
          <span className="w-full" key={index}>
            {index===0 && <span className="block p-4 w-full">----Languages----</span>}
            {index===12 && <span className="block p-4 w-full">----Coding Languages----</span>}
            <button className="w-full p-4 text-lg hover:bg-amber-500 cursor-pointer" onClick={(e)=>changeLanguage(language,e)}>{language}</button>
          </span>
        ))}
      </SheetDescription>
    </SheetHeader>
   
  </SheetContent>
</Sheet>
    )})

export default LanguageSelector