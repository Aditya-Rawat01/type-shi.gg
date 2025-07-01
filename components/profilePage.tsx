'use client'
import { charSetsAtom } from "@/app/store/atoms/charSets"
import { cumulativeIntervalAtom } from "@/app/store/atoms/cumulativeIntervals"
import { hashAtom } from "@/app/store/atoms/generatedHash"
import { modeAtom } from "@/app/store/atoms/mode"
import Topbar from "@/components/topbar";
import { cookieType, userCookie } from "@/app/store/atoms/userCookie"
import { URI } from "@/lib/URI"
import { TestPayload } from "@/lib/zodSchema"
import axios from "axios"
import { decodeJwt } from "jose"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { LoadingUserConfig } from "./TypeScreen"
import { animationOnProfileAtom } from "@/app/store/atoms/animationOnProfile"
import HistoryTable from "./historyTable"

const ZeroValues = {
  mode:"Placeholder",
  mode2: 0,
  accuracy: 0,
  rawWpm: 0,
  avgWpm: 0,
  charSets: [0,0,0,0]
}
export default function ProfilePage({sessionCookie}:{sessionCookie:cookieType}) {
    const [cookie,setCookie] = useAtom(userCookie)
    const [animation,setAnimation] = useAtom(animationOnProfileAtom)
    const [bodyToBeParsed, setBodyToBeParsed] = useState<TestPayload | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    useEffect(()=>{
        const value = localStorage.getItem("token") ? true : false;
        setCompletedTestBeforeSignIn(value)
        setCookie(sessionCookie)
    },[])
    useEffect(()=>{
      if (!animation) {
         setTimeout(()=>{
            setAnimation(true)
        },3000)
      }
    },[])
    const [completedTestBeforeSignedIn, setCompletedTestBeforeSignIn] = useState<boolean|null>(false)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setBodyToBeParsed(decodeJwt<TestPayload>(token));
    } catch {
      toast.error("Bad token in localStorage");
    }
  }, []);

    const {mode, mode2, accuracy, rawWpm, avgWpm, charSets:charArray}= bodyToBeParsed||ZeroValues
      const charArrayRepresentation = charArray[0]+" / "+charArray[1]+" / "+charArray[2]+" / "+charArray[3]
    async function handleClick(state:boolean) {

        setCompletedTestBeforeSignIn(false)
        if (!state) {
            localStorage.removeItem('token')
            return
        }

        if (accuracy<36 || !rawWpm || !avgWpm) {
        toast.error("Invalid test!")
        return
      }
      const body = {
        token: localStorage.getItem('token')
      }
      try {
        const res = await axios.post(`${URI}/api/saveTempTest`, body);
        toast.success(res.data.msg);
      } catch (error) {
        toast.warning("some fields are missing/tampered");
      }
        localStorage.removeItem('token')
    }
    const accuracyVal = parseFloat(accuracy.toFixed(2))
    const rawWpmVal = parseFloat(rawWpm.toFixed(2))
    const avgWpmVal = parseFloat(avgWpm.toFixed(2))
    return (
        <div className="w-full h-full">
            <LoadingUserConfig isMounted={animation}/>
            <Topbar/>
            <div className="w-full h-full relative bg-gray-300 text-black px-20">
            {completedTestBeforeSignedIn 
            &&
            <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl text-fuchsia-700 bg-gray-400 w-[80%] sm:w-[60%] xl:w-[40%] h-[50%]">
                <p className="w-full text-xl flex justify-center p-3">Last Signed out test</p>
                <p className="w-full flex justify-center">Would you like to save it?</p>
                <p className="w-full h-1 bg-gray-600"></p>
                <div className="bg-red-300 w-full h-20 flex flex-col items-center justify-center gap-3">
                    <p>Test type</p>
                    <p>{mode} {mode2}</p>
                </div>
                <div className=" w-full h-20 flex items-center justify-around">
                    <div>
                        <p>{rawWpmVal}</p>
                        <p>Raw Wpm</p>
                    </div>
                    <div>
                        <p>{avgWpmVal}</p>
                        <p>Avg Wpm</p>
                    </div>
                </div>
                <div className=" w-full h-20 flex items-center justify-around">
                    <div>
                        <p>{accuracyVal+"%"}</p>
                        <p>Accuracy</p>
                    </div>
                    <div>
                        <p>{charArrayRepresentation}</p>
                        <p>Characters</p>
                    </div>
                </div>
                <div className="flex justify-around items-center h-fit mt-3">
                    <button className="h-12 w-2/5 flex items-center justify-center bg-red-300 rounded-lg cursor-pointer" onClick={()=>handleClick(false)}>Discard</button>
                    <button className="h-12 w-2/5 flex items-center justify-center bg-red-300 rounded-lg cursor-pointer" onClick={()=>handleClick(true)}>Save</button>
                </div>
            </div>
            }
               <HistoryTable/>
          </div> 
        </div>
    )
}