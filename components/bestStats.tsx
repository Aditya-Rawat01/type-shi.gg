import {
  careerStatsAtom,
  careerStatsType,
} from "@/app/store/atoms/bestCareerStats";
import { URI } from "@/lib/URI";
import axios from "axios";
import { useAtom } from "jotai";
import { memo, useEffect } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const BestStats = memo(() => {
  const [bestCareerStats, setBestCareerStats] = useAtom(careerStatsAtom);

  useEffect(() => {
    async function fetchBestStats() {
      try {
        const res = await axios.get(`${URI}/api/get-stats`);
        const wrapper: { msg: careerStatsType } | { msg: {} } = res.data;
        const data = wrapper.msg;
        console.log({ data });
        data && Object.keys(data).length != 0
          ? setBestCareerStats((prev) => ({ ...prev, ...data }))
          : null;
      } catch (error) {
        (error as { status: number }).status === 500
          ? toast.error("Error occurred while fetching best stats.")
          : toast.error("User not logged in.");
      }
    }
    const shouldFetch = Object.values(bestCareerStats).reduce(
      (acc, curr) => acc + curr.avgWpm,
      0
    );
    shouldFetch <= 0 ? fetchBestStats() : null;
  }, []);
  const timeArr = [15, 30, 60, 120];
  const wordsArr = [10, 25, 50, 100];
  // write here that personal bests are dependen on the speed only not on the languages.
  return (
    <div className="sm:w-4/5 flex gap-6 h-32 justify-between">
      <div className="w-[50%] rounded-lg flex flex-col items-center gap-3">
        <p className="text-2xl">Time</p>
        <div className="w-full flex justify-around">
          {timeArr.map((time) => (
            <Tooltip key={time}>
              <TooltipTrigger>
                <p>{time} seconds</p>
                <p>{bestCareerStats["time" + time].avgWpm.toFixed(2)} wpm</p>
                <p>{bestCareerStats["time" + time].accuracy.toFixed(2)} %</p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-base">
                  raw: {bestCareerStats["time" + time].rawWpm.toFixed(2)}
                </p>
                <p className="text-base">
                  avg: {bestCareerStats["time" + time].avgWpm.toFixed(2)}
                </p>
                <p className="text-base">
                  accuracy: {bestCareerStats["time" + time].accuracy.toFixed(3)}
                  %
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="w-[50%] rounded-lg flex flex-col items-center gap-3">
        <p className="text-2xl">Words</p>
        <div className="w-full flex justify-around">
          {wordsArr.map((words) => (
            <Tooltip key={words}>
              <TooltipTrigger>
                <p>{words} words</p>
                <p>{bestCareerStats["words" + words].avgWpm.toFixed(2)} wpm</p>
                <p>{bestCareerStats["words" + words].accuracy.toFixed(2)} %</p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-base">
                  raw: {bestCareerStats["words" + words].rawWpm.toFixed(2)}
                </p>
                <p className="text-base">
                  avg: {bestCareerStats["words" + words].avgWpm.toFixed(2)}
                </p>
                <p className="text-base">
                  accuracy:{" "}
                  {bestCareerStats["words" + words].accuracy.toFixed(3)}%
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
});
export default BestStats;
