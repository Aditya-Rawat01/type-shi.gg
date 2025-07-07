import { careerStatsAtom, careerStatsType } from "@/app/store/atoms/bestCareerStats";
import { URI } from "@/lib/URI";
import axios from "axios";
import { useAtom } from "jotai";
import { memo, useEffect } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const BestStats = memo(()=>{
  const [bestCareerStats, setBestCareerStats] = useAtom(careerStatsAtom);

  useEffect(() => {
    async function fetchBestStats() {
      try {
        const res = await axios.get(`${URI}/api/get-stats`);
        const wrapper: { msg: careerStatsType } | { msg: {} } = res.data;
        const data = wrapper.msg;
        console.log(data);
        Object.keys(data).length != 0
          ? setBestCareerStats((prev) => ({ ...prev, ...data }))
          : null;
      } catch (error) {
        (error as { status: number }).status === 500
          ? toast.error("Error occurred while fetching best stats.")
          : toast.error("User not logged in.");
      }
    }
    fetchBestStats()
  },[]);
  const timeArr=[15,30,60,120]
  const wordsArr=[10,25,50,100]
        // write here that personal bests are dependen on the speed only not on the languages.
    return (
        <div className="sm:w-4/5 flex gap-6 h-32 bg-green-400 justify-between">
            
            <div className="w-[50%] rounded-lg bg-blue-500 flex justify-around">
                { timeArr.map((time)=>(
                    <Tooltip key={time}>
                        <TooltipTrigger>
                          <p>
                            {time} seconds
                          </p>
                          <p>
                            {bestCareerStats["time"+time].avgWpm} wpm
                          </p>
                          <p>
                            {bestCareerStats["time"+time].accuracy} %
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="p-2 text-base">raw: {bestCareerStats["time"+time].rawWpm}</p>
                          <p className="p-2 text-base">avg: {bestCareerStats["time"+time].avgWpm}</p>
                          <p className="p-2 text-base">accuracy: {bestCareerStats["time"+time].accuracy}</p>
                        </TooltipContent>
                      </Tooltip>
                ))}
            </div>
            <div className="w-[50%] rounded-lg bg-blue-500 flex justify-around">
                    { wordsArr.map((words)=>(
                    <Tooltip key={words}>
                        <TooltipTrigger>
                          <p>
                            {words} words
                          </p>
                          <p>
                            {bestCareerStats["words"+words].avgWpm} wpm
                          </p>
                          <p>
                            {bestCareerStats["words"+words].accuracy} %
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="p-2 text-base">raw: {bestCareerStats["words"+words].rawWpm}</p>
                          <p className="p-2 text-base">avg: {bestCareerStats["words"+words].avgWpm}</p>
                          <p className="p-2 text-base">accuracy: {bestCareerStats["words"+words].accuracy}</p>
                        </TooltipContent>
                      </Tooltip>
                ))}
            </div>
        </div>
    )

})
export default BestStats