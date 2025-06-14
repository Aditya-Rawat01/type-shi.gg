'use client'

import { useEffect, useState } from "react";
import axios from 'axios'
import { URI } from "@/lib/URI";
import generateTest from "@/lib/seed-Generation";
import { toast } from "sonner";
export default function Home() {
  const [language,setLanguage] = useState('English')
  const [words,setWords] = useState<string[]>([])
  const mode = 'words'
  useEffect(()=>{
    async function getWords() {
      const res = await axios.get(`${URI}/api/language/${language}`)
      const response=generateTest({mode:mode, wordList:res.data.msg.words as string[] })
      // the error is not being toasted. see the error why
      // after that send this uuid and its hash to the backend to generate and compare the strings.

      // the error is not being toasted when the words are undefined because of the type of property here.
      console.log(response)
      if (typeof response === "string") {
        toast.error(response)
        return <div> Error occurred.</div>
      }
      setWords(response)
    }
    getWords()
  },[language])
  console.log(words)
  return (
    <div>{words.map((index)=>{
      return <div>{index}</div>
    })}</div>
  );
}
