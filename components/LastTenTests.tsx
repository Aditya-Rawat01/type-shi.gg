import { resultsAtom } from "@/app/store/atoms/resultAtom"
import { useAtomValue } from "jotai"
import { results } from "./profilePage"
import BarGraph from "./BarGraph"
import { memo } from "react"

const LastTenTests = memo(()=>{
    // calculate last 10 tests top 10 problematic keys
    // then use circular chart or bar chart to show them
    const results = useAtomValue(resultsAtom)
    const graphData = calculateTopProblematicKeys(results)
    console.log({graphData})
    return (
        <div className="sm:w-4/5 h-[500px] flex flex-col items-center justify-around">
            <p>Top 10 Problematic Keys (Last 10 tests)</p>
            <BarGraph graphData={graphData}/>
        </div>
    )
})
export default LastTenTests

function calculateTopProblematicKeys(results:results) {
    const entireArr = results.reduce<{ wpm: number; rawWpm: number; interval: number; errors: number; problematicKeys: string[]; }[]>((acc,curr)=>{
        acc.push(...curr.flameGraph)
        return acc
    },[])
    const problematicKeysArr = entireArr.reduce<string[]>((acc,curr)=>{
        acc.push(...curr.problematicKeys)
        return acc
    },[])

  const freq: Record<string, number> = {};
  for (const k of problematicKeysArr) {
    freq[k] = (freq[k] ?? 0) + 1;
  }
  // sort
  const desc=Object.entries(freq)
    .sort(([, aCount], [, bCount]) => bCount - aCount)   // ← sort here
    .map(([key, count]) => ({ [key]: count }));
    return desc.slice(0, 9);
}