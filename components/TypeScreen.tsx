'use client'

import { Settings2Icon } from "lucide-react";
import { useState } from "react"
import TypingArea from "./typingArea";

export default function TypeScreen() {
    const [selection,setSelection] = useState('time') // from cookies or localstorage
    const [numberSelected, setNumberSelected] = useState(30); // similar
    const [punchAndNum , setPunchAndNum] = useState<{"punctuation"?:boolean,numbers?:boolean}>({
        "punctuation":false,
        "numbers":false
    })
    const [showPanel, setShowPanel] = useState(false)
    function setSelectionFn(choice:string) {
        if (choice==="time") {
            setSelection('time')
            setNumberSelected(30)
        } else {
            setSelection('words')
            setNumberSelected(50)
        }
    }
    return (
    <div className="flex justify-center p-5 h-full flex-col items-center gap-10 bg-black cursor-pointer relative">
    <div className="bg-yellow-400 w-full h-fit p-5 flex items-center rounded-full justify-center sm:hidden">
        <p className="relative left-5">Test Settings</p>
        <Settings2Icon onClick={()=>setShowPanel((prev)=>!prev)} className="relative left-14"/>
        <div className={`floating div absolute rounded-xl w-[90%] h-[95%] top-1/2 -translate-y-1/2 bg-yellow-400 flex-col items-center justify-center gap-5 z-50 ${showPanel?"flex":"hidden"}`}>
            <p onClick={()=>{setPunchAndNum((prev)=>({...prev,punctuation:!prev.punctuation}))}} className={`transition-colors duration-200 ease-out ${punchAndNum.punctuation && "text-white"}`}>punctuation</p>
            <p onClick={()=>{setPunchAndNum((prev)=>({...prev,numbers:!prev.numbers}))}} className={`transition-colors duration-200 ease-out ${punchAndNum.numbers && "text-white"}`}>numbers</p>
            <br/>
            <p onClick={()=>setSelectionFn("time")}  className={`hover:text-white ${selection==="time" && "text-white"}`}>time</p>
            <p onClick={()=>setSelectionFn("words")} className={`hover:text-white ${selection==="words" && "text-white"}`}>words</p>
            <br/>
            <div className={`transition-opacity duration-700 ease-in ${selection=="time"?"flex flex-col gap-4":"hidden"}`}>
            <p onClick={()=>setNumberSelected(15)} className={`hover:text-white ${numberSelected===15 && "text-white"}`}>15</p>
            <p onClick={()=>setNumberSelected(30)} className={`hover:text-white ${numberSelected===30 && "text-white"}`}>30</p>
            <p onClick={()=>setNumberSelected(60)} className={`hover:text-white ${numberSelected===60 && "text-white"}`}>60</p>
            <p onClick={()=>setNumberSelected(120)} className={`hover:text-white ${numberSelected===120 && "text-white"}`}>120</p>
        </div>
        <div className={`transition-opacity duration-700 ease-in ${selection=="words"?"flex flex-col gap-4":"hidden"}`}>
            <p onClick={()=>setNumberSelected(10)} className={`hover:text-white ${numberSelected===10 && "text-white"}`}>10</p>
            <p onClick={()=>setNumberSelected(25)} className={`hover:text-white ${numberSelected===25 && "text-white"}`}>25</p>
            <p onClick={()=>setNumberSelected(50)} className={`hover:text-white ${numberSelected===50 && "text-white"}`}>50</p>
            <p onClick={()=>setNumberSelected(100)} className={`hover:text-white ${numberSelected===100 && "text-white"}`}>100</p>
        </div>


        <button className="w-[95%] h-10 bg-white rounded-lg" onClick={()=>setShowPanel(false)}>Go</button>
        </div>
    </div>
    <div className="bg-yellow-400 w-[600px] h-fit p-5 rounded-full hidden sm:flex items-center justify-center gap-5">
        
        <p onClick={()=>{setPunchAndNum((prev)=>({...prev,punctuation:!prev.punctuation}))}} className={`transition-colors duration-200 ease-out ${punchAndNum.punctuation && "text-white"}`}>punctuation</p>
        <p onClick={()=>{setPunchAndNum((prev)=>({...prev,numbers:!prev.numbers}))}} className={`transition-colors duration-200 ease-out ${punchAndNum.numbers && "text-white"}`}>numbers</p>
        <p>|</p>
        <p onClick={()=>setSelectionFn("time")}  className={`hover:text-white ${selection==="time" && "text-white"}`}>time</p>
        <p onClick={()=>setSelectionFn("words")} className={`hover:text-white ${selection==="words" && "text-white"}`}>words</p>
        <p>|</p>

        <div className={`transition-opacity duration-700 ease-in ${selection=="time"?"flex gap-4":"hidden"}`}>
            <p onClick={()=>setNumberSelected(15)} className={`hover:text-white ${numberSelected===15 && "text-white"}`}>15</p>
            <p onClick={()=>setNumberSelected(30)} className={`hover:text-white ${numberSelected===30 && "text-white"}`}>30</p>
            <p onClick={()=>setNumberSelected(60)} className={`hover:text-white ${numberSelected===60 && "text-white"}`}>60</p>
            <p onClick={()=>setNumberSelected(120)} className={`hover:text-white ${numberSelected===120 && "text-white"}`}>120</p>
        </div>
        <div className={`transition-opacity duration-700 ease-in ${selection=="words"?"flex gap-4":"hidden"}`}>
            <p onClick={()=>setNumberSelected(10)} className={`hover:text-white ${numberSelected===10 && "text-white"}`}>10</p>
            <p onClick={()=>setNumberSelected(25)} className={`hover:text-white ${numberSelected===25 && "text-white"}`}>25</p>
            <p onClick={()=>setNumberSelected(50)} className={`hover:text-white ${numberSelected===50 && "text-white"}`}>50</p>
            <p onClick={()=>setNumberSelected(100)} className={`hover:text-white ${numberSelected===100 && "text-white"}`}>100</p>
        </div>
        
    </div>

        <TypingArea/>
    </div>)
}