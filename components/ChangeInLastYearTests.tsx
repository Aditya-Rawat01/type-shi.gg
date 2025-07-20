import { resultsAtom } from "@/app/store/atoms/resultAtom";
import { useAtomValue } from "jotai";
import { memo } from "react";
import { results } from "./profilePage";
import ChangeLineChart from "./ChangeLineChart";
import { LastYearResult, lastYearResultAtom } from "@/app/store/atoms/lastYearTest";

const ChangeInLastYearTests = memo(()=>{
    const results = useAtomValue(lastYearResultAtom)
    const {avgWpmArr, rawWpmArr, accuracyArr } = calculateGraphValues(results)
    return (
        <div className="w-5/6 sm:w-4/5 h-[500px] flex flex-col items-center justify-around">
            <p>Last Year Tests</p>
            <ChangeLineChart rawWpm={rawWpmArr} accuracy={accuracyArr} avgWpm={avgWpmArr}/>
        </div>
    )
})

export default ChangeInLastYearTests

function calculateGraphValues(results:LastYearResult) {
    const avgWpmArr = results.map((data)=>data.avgWpm)
    const rawWpmArr = results.map((data)=>data.rawWpm)
    const accuracyArr = results.map((data)=>data.accuracy)
    return {avgWpmArr, rawWpmArr, accuracyArr}
}