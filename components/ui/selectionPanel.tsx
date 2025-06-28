'use client'
import { modeAtom } from "@/app/store/atoms/mode";
import { selectionPanelVisibleAtom } from "@/app/store/atoms/selectionPanelVisibility";
import { localStorageConfig } from "@/lib/localStorageConfig";
import { useAtom, useAtomValue } from "jotai";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";

export default function SelectionPanel() {
  const [selection, setSelection] = useAtom(modeAtom); // from cookies or localstorage mode or time for now.
  const visibility = useAtomValue(selectionPanelVisibleAtom)
  const [showPanel, setShowPanel] = useState(false);
  const time = [15,30,60,120]
  const words = [10,25,50,100]

  function setSelectionFn({
    choice,
  }: {
    choice: "words" | "time" | "numbers" | "punctuation";
}) {
    setSelection((prev) => {
      if (choice === "numbers") {
        return { ...prev, numbers: !prev.numbers };
      } else if (choice === "punctuation") {
        return { ...prev, punctuation: !prev.punctuation };
      } else if (choice === "time") {
        return { ...prev, mode: "time" };
      } else {
        return { ...prev, mode: "words" };
      }
    });
  }

  function changeValues(value: number) {
    if (value <= 0) return;
    setSelection((prev) => {
      if (selection.mode === "time") {
        return { ...prev, time: value };
      } else {
        if (!prev) return prev;
        return { ...prev, words: value };
      }
    });
  }

  return (
    <div className={`flex justify-center p-5 h-32 flex-col items-center gap-10 bg-black cursor-pointer ${visibility?"opacity-100":"opacity-0 pointer-events-none"} transition-opacity duration-300 ease-in `}>
      <div className="bg-yellow-400 w-full h-fit p-5 flex items-center rounded-full justify-center sm:hidden">
        <p className="relative left-5">Test Settings</p>
        <Settings2Icon
          onClick={() => setShowPanel((prev) => !prev)}
          className="relative left-14"
        />
        <div
          className={`floating div absolute rounded-xl w-[90%] h-[95%] top-1/2 -translate-y-1/2 bg-yellow-400 flex-col items-center justify-center gap-5 z-50 ${
            showPanel ? "flex" : "hidden"
          }`}
        >
          <p
            onClick={() =>
              setSelectionFn({
                choice: "punctuation",
              })
            }
            className={`transition-colors duration-200 ease-out ${
              selection.punctuation && "text-white"
            }`}
          >
            punctuation
          </p>

          <p
            onClick={() => setSelectionFn({ choice: "numbers" })}
            className={`transition-colors duration-200 ease-out ${
              selection.numbers && "text-white"
            }`}
          >
            numbers
          </p>
          <br />
          <p
            onClick={() => setSelectionFn({ choice: "time" })}
            className={`hover:text-white ${
              selection.mode === "time" && "text-white"
            }`}
          >
            time
          </p>
          
          <p
            onClick={() => setSelectionFn({ choice: "words" })}
            className={`hover:text-white ${
              selection.mode === "words" && "text-white"
            }`}
          >
            words
          </p>
          <br />
          <div
            className={`transition-opacity duration-700 ease-in ${
              selection.mode == "time" ? "flex flex-col gap-4" : "hidden"
            }`}
          >
            {time.map((index)=>{
            return (
                <p
                key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white ${
                selection.time === index && "text-white"
              }`}
            >
              {index}
            </p>
            )
          })}
            
          </div>
          <div
            className={`transition-opacity duration-700 ease-in ${
              selection.mode == "words" ? "flex flex-col gap-4" : "hidden"
            }`}
          >
            {words.map((index)=>{
                return (
                    <p
                    key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white ${
                selection.words === index && "text-white"
              }`}
            >
              {index}
            </p>
                )
            })}
          </div>

          <button
            className="w-[95%] h-10 bg-white rounded-lg"
            onClick={() => setShowPanel(false)}
          >
            Go
          </button>
        </div>
      </div>
      <div className="bg-yellow-400 w-[600px] h-fit p-5 rounded-full hidden sm:flex items-center justify-center gap-5">
        <p
          onClick={() => {
            setSelectionFn({ choice: "punctuation" });
          }}
          className={`transition-colors duration-200 ease-out ${
            selection.punctuation && "text-white"
          }`}
        >
          punctuation
        </p>
        <p
          onClick={() => {
            setSelectionFn({ choice: "numbers" });
          }}
          className={`transition-colors duration-200 ease-out ${
            selection.numbers && "text-white"
          }`}
        >
          numbers
        </p>
        <p>|</p>
        <p
          onClick={() => setSelectionFn({ choice: "time" })}
          className={`hover:text-white ${
            selection.mode === "time" && "text-white"
          }`}
        >
          time
        </p>
        <p
          onClick={() => setSelectionFn({ choice: "words" })}
          className={`hover:text-white ${
            selection.mode === "words" && "text-white"
          }`}
        >
          words
        </p>
        <p>|</p>

        <div
          className={`transition-opacity duration-700 ease-in ${
            selection.mode == "time" ? "flex gap-4" : "hidden"
          }`}
        >
            {time.map((index)=>{
            return (
                <p
                    key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white ${
                selection.time === index && "text-white"
              }`}
            >
              {index}
            </p>
            )
          })}
        </div>
        <div
          className={`transition-opacity duration-700 ease-in ${
            selection.mode == "words" ? "flex gap-4" : "hidden"
          }`}
        >
            {words.map((index)=>{
            return (
                <p
                    key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white ${
                selection.words === index && "text-white"
              }`}
            >
              {index}
            </p>
            )
          })}
        </div>
      </div>
    </div>
  );
}
