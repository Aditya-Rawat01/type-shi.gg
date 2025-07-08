import { resultsAtom } from "@/app/store/atoms/resultAtom";
import { useAtomValue } from "jotai";
import { memo } from "react";
import { results } from "./profilePage";
import ChangeLineChart from "./ChangeLineChart";

const ChangeInLastTenTests = memo(()=>{
    const results = useAtomValue(resultsAtom)
    const {avgWpmArr, rawWpmArr, accuracyArr } = calculateGraphValues(results)
    return (
        <div className="sm:w-4/5 h-[500px] flex flex-col itmes-center justify-around">
            <p>Last 10 Tests</p>
            <ChangeLineChart rawWpm={rawWpmArr} accuracy={accuracyArr} avgWpm={avgWpmArr}/>
        </div>
    )
})

export default ChangeInLastTenTests

function calculateGraphValues(results:results) {
    const avgWpmArr = results.map((data)=>data.avgWpm)
    const rawWpmArr = results.map((data)=>data.rawWpm)
    const accuracyArr = results.map((data)=>data.accuracy)
    return {avgWpmArr, rawWpmArr, accuracyArr}
}