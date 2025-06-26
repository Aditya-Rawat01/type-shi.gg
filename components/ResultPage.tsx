import { restartSameTestAtom, shadowTestAtom } from "@/app/store/atoms/restartSameTest";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight, ListRestart, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ResultPage({
  setShowResultPage,
  charArray,
  setCharArray,
}: {
  setShowResultPage: Dispatch<SetStateAction<boolean>>;
  charArray: number[];
  setCharArray: Dispatch<SetStateAction<number[]>>;
}) {
  const setRestartSameTest = useSetAtom(restartSameTestAtom)
  const shadowTest = useAtom(shadowTestAtom)
    function handleClick(state:boolean) {
      setRestartSameTest(state)
      setShowResultPage(false)
    }
  return <div className="w-screen h-screen flex flex-col items-center justify-start pt-12 gap-3 bg-red-300">
    <div className="wpms w-full flex h-20 bg-green-500 items-center text-md sm:text-2xl justify-around">
      <p>Raw wpm</p>
      <p>wpm</p>
      <p>Accuracy</p>
    </div>
    <div className="graph h-96 bg-red-400 w-full"></div>
    <div className="flex items-center justify-center gap-10 h-20 w-full bg-blue-500">
      
      <Tooltip>
        <TooltipTrigger>
          <RotateCcw onClick={()=>handleClick(true)} className="cursor-pointer"/>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Repeat Test</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <ChevronRight onClick={()=>handleClick(false)}  className="cursor-pointer"/>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Next Test</p>
        </TooltipContent>
      </Tooltip>
      
    </div>
    </div>;
}
