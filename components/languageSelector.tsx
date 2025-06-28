import { useAtom, useSetAtom } from "jotai";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { modeAtom } from "@/app/store/atoms/mode";
import { memo, useState } from "react";
import { LanguagesIcon } from "lucide-react";
import { shouldFetchLanguageAtom } from "@/app/store/atoms/shouldFetchLang";


type languageType = 'English'|'English1k'

const LanguageSelector=memo(()=>{
    const [mode, setMode] = useAtom(modeAtom)
    const [open, setOpen] = useState(false)
    const setChangeLanguage = useSetAtom(shouldFetchLanguageAtom)
    const languages:languageType[] = ["English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k","English","English1k"]
    function changeLanguage(lang:languageType) {
        console.log(lang)
        mode.language!==lang?setMode((prev)=>({...prev, language:lang })):null
        mode.language!==lang?setChangeLanguage(true):null 
        setOpen(false)
    }
    return (
    <Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger className="flex gap-2 cursor-pointer">
    <p><LanguagesIcon /></p>
    <p>{mode.language}</p>
    </SheetTrigger>
  <SheetContent>
    <SheetHeader className="px-0 py-5 overflow-auto cursor-pointer">
      <SheetTitle>Languages</SheetTitle>
      <SheetDescription className="bg-green-400 w-full flex flex-col">
        {languages.map((language, index)=>(
            <button key={index} className="p-4 text-lg hover:bg-amber-500" onClick={()=>changeLanguage(language)}>{language}</button>
        ))}
      </SheetDescription>
    </SheetHeader>
   
  </SheetContent>
</Sheet>
    )})

export default LanguageSelector