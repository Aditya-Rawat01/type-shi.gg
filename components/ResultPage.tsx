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
    console.log(charArray)
  return <div className="w-screen h-screen flex items-center justify-center bg-red-300">500 wpm = world record ohh maah godd</div>;
}
