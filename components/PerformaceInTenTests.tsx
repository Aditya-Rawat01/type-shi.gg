import {
  careerStatsAtom,
  careerStatsType,
} from "@/app/store/atoms/bestCareerStats";
import { resultsAtom } from "@/app/store/atoms/resultAtom";
import { useAtomValue } from "jotai";
import { memo } from "react";

const PerformaceInTenTests = memo(() => {
  const results = useAtomValue(resultsAtom);
  const bestStats = useAtomValue(careerStatsAtom);
  const {
    rawWpm: topRawWpm,
    avgWpm: topAvgWpm,
    accuracy: topAccuracy,
  } = computeBests(bestStats);
  const summary = results.reduce(
    (acc, r) => {
      acc.bestRaw = Math.max(acc.bestRaw, r.rawWpm);
      acc.bestAvg = Math.max(acc.bestAvg, r.avgWpm);
      acc.bestAcc = Math.max(acc.bestAcc, r.accuracy);

      acc.sumRaw += r.rawWpm;
      acc.sumAvg += r.avgWpm;
      acc.sumAcc += r.accuracy;
      return acc;
    },
    {
      bestRaw: 0,
      bestAvg: 0,
      bestAcc: 0,
      sumRaw: 0,
      sumAvg: 0,
      sumAcc: 0,
    }
  );
  const len = results.length || 1; // if results len = 0
  const avgRaw = (summary.sumRaw / len).toFixed(2);
  const avgAvg = (summary.sumAvg / len).toFixed(2);
  const avgAcc = (summary.sumAcc / len).toFixed(2);
  const bestRawWpmInTenTests = summary.bestRaw.toFixed(2);
  const bestAccuracyInTenTests = summary.bestAcc.toFixed(2);
  const bestAvgWpmInTenTests = summary.bestAvg.toFixed(2);
  const topRawWpmTestType = topRawWpm.test.split(/(\d+)/);
  const topAvgWpmTestType = topAvgWpm.test.split(/(\d+)/);
  const topAccuracyTestType = topAccuracy.test.split(/(\d+)/);

  return (
    <div className="hidden sm:w-4/5 h-[300px] p-2 sm:text-2xl sm:grid grid-rows-3 gap-6  outline-2 outline-[var(--backgroundSecondary)] rounded-xl">
      <div
        className="grid grid-cols-3 gap-4 items-center justify-items-center">
        <div className="flex flex-col items-center">
          <p>{avgRaw}</p>
          <p className="text-sm">Avg Raw WPM</p>
        </div>
        <div className="flex flex-col items-center">
          <p>{avgAvg}</p>
          <p className="text-sm">Avg WPM</p>
        </div>
        <div className="flex flex-col items-center">
          <p>{avgAcc + "%"}</p>
          <p className="text-sm">Avg Accuracy</p>
        </div>
      </div>

      <div className=" grid grid-cols-3 gap-4 items-center justify-items-center">
        <div className="flex flex-col items-center">
          <p>{bestRawWpmInTenTests}</p>
          <p className="text-sm">
            Best Raw WPM
            <br />
            (last 10)
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p>{bestAvgWpmInTenTests}</p>
          <p className="text-sm">
            Best WPM
            <br />
            (last 10)
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p>{bestAccuracyInTenTests + "%"}</p>
          <p className="text-sm">
            Best Accuracy
            <br />
            (last 10)
          </p>
        </div>
      </div>

      <div
        className=" grid grid-cols-3 gap-4 items-center justify-items-center">
        <div className="flex flex-col items-center">
          <p>{topRawWpm.value}</p>
          <p className="text-sm">Highest Raw WPM</p>
          <p className="text-xs">{topRawWpmTestType[0] + " " + topRawWpmTestType[1]}</p>
        </div>
        <div className="flex flex-col items-center">
          <p>{topAvgWpm.value}</p>
          <p className="text-sm">Highest Avg WPM</p>
          <p className="text-xs">{topAvgWpmTestType[0] + " " + topAvgWpmTestType[1]}</p>
        </div>
        <div className="flex flex-col items-center">
          <p>{topAccuracy.value} %</p>
          <p className="text-sm">Highest Accuracy</p>
          <p className="text-xs">{topAccuracyTestType[0] + " " + topAccuracyTestType[1]}</p>
        </div>
      </div>
    </div>
  );
});

export default PerformaceInTenTests;

type BestOf = {
  rawWpm: { value: number; test: string };
  avgWpm: { value: number; test: string };
  accuracy: { value: number; test: string };
};

function computeBests(stats: careerStatsType): BestOf {
  return Object.entries(stats).reduce<BestOf>(
    (best, [test, block]) => {
      if (block.rawWpm > best.rawWpm.value)
        best.rawWpm = { value: block.rawWpm, test };
      if (block.avgWpm > best.avgWpm.value)
        best.avgWpm = { value: block.avgWpm, test };
      if (block.accuracy > best.accuracy.value)
        best.accuracy = { value: block.accuracy, test };
      return best;
    },
    {
      rawWpm: { value: 0, test: "time15" },
      avgWpm: { value: 0, test: "time15" },
      accuracy: { value: 0, test: "time15" },
    }
  );
}
