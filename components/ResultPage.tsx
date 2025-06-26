import { restartSameTestAtom, shadowTestAtom } from "@/app/store/atoms/restartSameTest";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight, ListRestart, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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
  console.log({shadowTest})
    console.log(charArray)
    function handleClick(state:boolean) {
      setRestartSameTest(state)
      setShowResultPage(false)
    }
  return <div className="w-screen h-screen flex flex-col items-center justify-center bg-red-300">
    500 wpm = world record ohh maah godd

    <div className="flex gap-4">
      <RotateCcw onClick={()=>handleClick(true)}/>
      <ChevronRight onClick={()=>handleClick(false)}/>
    </div>
    </div>;
}
