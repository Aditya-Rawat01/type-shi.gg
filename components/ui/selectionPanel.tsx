'use client'
import { modeAtom } from "@/app/store/atoms/mode";
import { selectionPanelVisibleAtom } from "@/app/store/atoms/selectionPanelVisibility";
import { localStorageConfig } from "@/lib/localStorageConfig";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Settings2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
export default function SelectionPanel() {
  const [selection, setSelection] = useAtom(modeAtom); // from cookies or localstorage mode or time for now.
  const visibility = useAtomValue(selectionPanelVisibleAtom)
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
    <div id="focusStaysActive" tabIndex={0} className={`flex text-[var(--text)] justify-center h-fit flex-col items-center gap-10 p-3 cursor-pointer ${visibility?"opacity-100":"opacity-0 pointer-events-none"} transition-opacity duration-300 ease-in `}>
      <div className="w-full h-fit p-5 flex items-center rounded-full justify-center bg-black/20 sm:hidden">
        <p className="relative left-5">Test Settings</p>
        
        <Dialog>
          <DialogTrigger>
            <Settings2Icon
          className="relative left-14"
          /></DialogTrigger>
          <DialogContent className="w-[90%]">
          <DialogTitle>Test Settings</DialogTitle>
            <DialogHeader>
              <div className="flex flex-col items-center gap-3">
          <p
            onClick={() =>
              setSelectionFn({
                choice: "punctuation",
              })
            }
            className={`transition-colors duration-200 ease-out bg-black/20 rounded-sm p-3 w-full ${
              selection.punctuation && "text-white"
            }`}
          >
            punctuation
          </p>

          <p
            onClick={() => setSelectionFn({ choice: "numbers" })}
            className={`transition-colors duration-200 ease-out bg-black/20 rounded-sm p-3 w-full ${
              selection.numbers && "text-white"
            }`}
          >
            numbers
          </p>
          <br />
          <p
            onClick={() => setSelectionFn({ choice: "time" })}
            className={`hover:text-white bg-black/20 rounded-sm p-3 w-full ${
              selection.mode === "time" && "text-white"
            }`}
          >
            time
          </p>
          
          <p
            onClick={() => setSelectionFn({ choice: "words" })}
            className={`hover:text-white bg-black/20 rounded-sm p-3 w-full ${
              selection.mode === "words" && "text-white"
            }`}
          >
            words
          </p>
          <br />
          <div
            className={`transition-opacity duration-700 ease-in w-full ${
              selection.mode == "time" ? "flex flex-col gap-4" : "hidden"
            }`}
          >
            {time.map((index)=>{
            return (
                <p
                key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white bg-black/20 rounded-sm p-3 w-full ${
                selection.time === index && "text-white"
              }`}
            >
              {index}
            </p>
            )
          })}
            
          </div>
          <div
            className={`transition-opacity duration-700 ease-in w-full ${
              selection.mode == "words" ? "flex flex-col gap-4" : "hidden"
            }`}
          >
            {words.map((index)=>{
                return (
                    <p
                    key={index}
              onClick={() => changeValues(index)}
              className={`hover:text-white bg-black/20 rounded-sm p-3 w-full ${
                selection.words === index && "text-white"
              }`}
            >
              {index}
            </p>
                )
            })}
          </div>
        </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-black/20 w-[600px] h-fit p-3 rounded-full hidden sm:flex items-center justify-center gap-5">
        <p
          onClick={() => {
            setSelectionFn({ choice: "punctuation" });
          }}
          className={`transition-colors duration-200 ease-out hover:text-[var(--backgroundSecondary)] ${
            selection.punctuation && "text-[var(--backgroundSecondary)]"
          }`}
        >
          punctuation
        </p>
        <p
          onClick={() => {
            setSelectionFn({ choice: "numbers" });
          }}
          className={`transition-colors duration-200 ease-out hover:text-[var(--backgroundSecondary)] ${
            selection.numbers && "text-[var(--backgroundSecondary)]"
          }`}
        >
          numbers
        </p>
        <p>|</p>
        <p
          onClick={() => setSelectionFn({ choice: "time" })}
          className={`hover:text-[var(--backgroundSecondary)] ${
            selection.mode === "time" && "text-[var(--backgroundSecondary)]"
          }`}
        >
          time
        </p>
        <p
          onClick={() => setSelectionFn({ choice: "words" })}
          className={`hover:text-[var(--backgroundSecondary)] ${
            selection.mode === "words" && "text-[var(--backgroundSecondary)]"
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
              className={`hover:text-[var(--backgroundSecondary)] ${
                selection.time === index && "text-[var(--backgroundSecondary)]"
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
              className={`hover:text-[var(--backgroundSecondary)] ${
                selection.words === index && "text-[var(--backgroundSecondary)]"
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
