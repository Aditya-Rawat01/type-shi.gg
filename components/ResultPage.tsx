import {
  restartSameTestAtom,
  shadowTestAtom,
} from "@/app/store/atoms/restartSameTest";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight, Images, ListRestart, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Chart as ChartJS,
  // controllers & elements
  LineController,
  ScatterController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  // plugins
  Tooltip as tooltipChart,
  Legend,
  Title,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { cumulativeIntervalAtom } from "@/app/store/atoms/cumulativeIntervals";
import { modeAtom } from "@/app/store/atoms/mode";
import { afkAtom } from "@/app/store/atoms/afkModeAtom";
import { toast } from "sonner";
import { hashAtom } from "@/app/store/atoms/generatedHash";
import axios from "axios";
import { URI } from "@/lib/URI";

export default function ResultPage({
  setShowResultPage,
  charArray,
  setCharArray,
}: {
  setShowResultPage: Dispatch<SetStateAction<boolean>>;
  charArray: number[];
  setCharArray: Dispatch<SetStateAction<number[]>>;
}) {
  const [repeatedTest,setRestartSameTest] = useAtom(restartSameTestAtom);
  const shadowRepeatedRef = useRef(repeatedTest) // this helps in removing the flicker of change in flag of repeated test.
  console.log({shadowRepeatedRef, repeatedTest})
  const shadowTest = useAtom(shadowTestAtom);
  const selection = useAtomValue(modeAtom);
  const isAfk = useAtomValue(afkAtom);
  const hash = useAtomValue(hashAtom)
  const cumulativeInterval = useAtomValue(cumulativeIntervalAtom);
  // send the data to backend.
  // send the [correct, incorrect, missed, extra]
  // send the accuracy (once done)
  // send the raw and avg wpm
  // send the {generatedHash, initialseed, generationAmt}
  // send some particular identifier to know the person.
  // user table id or userId is going to be the identifier.
  useEffect(()=>{
    if (isAfk || repeatedTest) {
      toast.warning("Test will not be stored.");
      return
    }
    async function dataSender() {
      const mode2 = selection.mode==="words"?selection.words:selection.time
      const body = {
        charSets : charArray, // correct, incorrect, extra, missed
        mode: selection.mode,
        mode2: mode2,
        flameGraph: cumulativeInterval,
        accuracy : 98.01, // hardcoded for a while.
        rawWpm:70,
        avgWpm:65,
        language: selection.language,
        // these will not be saved.
        initialSeed: hash.originalSeed,
        generatedAmt: hash.GeneratedAmt,
        finalHash: hash.hash
      }
      try {
        
        const res = await axios.post(`${URI}/api/test`, body)
        toast.success(res.data.msg)
      } catch (error) {
        toast.warning("some fields are missing/tampered")  
      }
      
    }

    dataSender()
  },[])
  const titleText = [
    selection.mode +
      " " +
      (selection.mode === "time"
        ? selection.time.toString()
        : selection.words.toString()),
    selection.language,
  ];
  function handleClick(state: boolean) {
    setRestartSameTest(state);
    setShowResultPage(false);
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-12 gap-3 bg-red-300">
      <div className="wpms w-full flex h-20 bg-green-500 items-center text-md sm:text-2xl justify-around">
        <p>Raw wpm</p>
        <p>wpm</p>
        <p>Accuracy</p>
      </div>
      <div className="graph h-80 bg-orange-400 w-4/5 flex flex-col">
        <div className="text-xl pl-10 relative">
          <p>{titleText[0]}</p>
          <p>{titleText[1]}</p>
          {shadowRepeatedRef.current?<p className="absolute top-2 right-10 rounded-2xl bg-red-700 px-3 py-2 text-white">Repeated Test</p>:null}
          {isAfk?<p className="absolute top-2 left-1/2 -translate-x-1/2 rounded-2xl bg-violet-700 px-3 py-2 text-white">Afk detected (ㆆ_ㆆ)</p>:null}
          {/* // if is afk only then this will be shown */}
          </div>
        <ChartRender />
      </div>
      <div className="flex items-center justify-center gap-10 h-20 w-full bg-blue-500">
        <Tooltip>
          <TooltipTrigger>
            <RotateCcw
              onClick={() => handleClick(true)}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="p-2">Repeat Test</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <ChevronRight
              onClick={() => handleClick(false)}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="p-2">Next Test</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Images
              onClick={() => handleClick(false)}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="p-2">Screenshot</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

type Mixed = "scatter" | "line";
ChartJS.register(
  LineController,
  ScatterController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  tooltipChart,
  Legend,
  Title
);

function ChartRender() {
  const cumulativeInterval = useAtomValue(cumulativeIntervalAtom);
  const wpmData = cumulativeInterval.map((s) => ({ x: s.interval, y: s.wpm }));
  const rawData = cumulativeInterval.map((s) => ({
    x: s.interval,
    y: s.rawWpm,
  }));
  const errorPts = cumulativeInterval.map((s) => ({
    x: s.interval,
    y: s.errors === 0 ? NaN : s.errors,
  }));

  return (
    <div className="w-full h-3/4">
      <Chart<Mixed, (number | { x: number; y: number })[], number>
        type="scatter"
        data={{
          datasets: [
            {
              label: "Raw WPM",
              type: "line",
              data: rawData,
              borderColor: "rgba(54,162,235,1)",
              borderWidth: 2,
              borderDash: [6, 4],
              pointStyle: "triangle",
              tension: 0.3,
              yAxisID: "y",
            },
            {
              label: "Avg WPM",
              type: "line",
              data: wpmData,
              borderColor: "rgba(134,12,35,1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y",
            },
            {
              label: "Errors",
              type: "scatter",
              data: errorPts,
              pointRadius: 5,
              pointBackgroundColor: "rgba(255,99,132,1)",
              yAxisID: "y2",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          interaction: {
            // <-- affects both hover + tooltip
            mode: "x", // compare all datasets with the same x
            intersect: false,
          },
          plugins: {
            tooltip: {
              mode: "x",
              intersect: false,
            },
            legend: { position: "top" },
          },

          scales: {
            x: {
              type: "linear",
              min: cumulativeInterval[0] ? cumulativeInterval[0].interval : 0,
              max: cumulativeInterval.at(-1)
                ? cumulativeInterval.at(-1)!.interval
                : 1,
              ticks: {
                stepSize: cumulativeInterval.length <= 30 ? 1 : undefined,
                precision: 0,
              },
              grid: { drawOnChartArea: false },
            },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 20 },
              title: { display: true, text: "WPM" },
            },
            y2: {
              position: "right",
              beginAtZero: true,
              grid: { drawOnChartArea: false },
              ticks: { stepSize: 1 },
              title: { display: true, text: "Errors" },
            },
          },
        }}
      />
    </div>
  );
}
