import { restartSameTestAtom, shadowTestAtom } from "@/app/store/atoms/restartSameTest";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight, Images, ListRestart, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
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

export default function ResultPage({
  setShowResultPage,
  charArray,
  setCharArray,
}: {
  setShowResultPage: Dispatch<SetStateAction<boolean>>;
  charArray: number[];
  setCharArray: Dispatch<SetStateAction<number[]>>;
}) {
  const setRestartSameTest = useSetAtom(restartSameTestAtom)
  const shadowTest = useAtom(shadowTestAtom)
    function handleClick(state:boolean) {
      setRestartSameTest(state)
      setShowResultPage(false)
    }
  return <div className="w-screen h-screen flex flex-col items-center justify-start pt-12 gap-3 bg-red-300">
    <div className="wpms w-full flex h-20 bg-green-500 items-center text-md sm:text-2xl justify-around">
      <p>Raw wpm</p>
      <p>wpm</p>
      <p>Accuracy</p>
    </div>
    <div className="graph h-96 bg-white w-full">
      <ChartRender/>
    </div>
    <div className="flex items-center justify-center gap-10 h-20 w-full bg-blue-500">
      
      <Tooltip>
        <TooltipTrigger>
          <RotateCcw onClick={()=>handleClick(true)} className="cursor-pointer"/>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Repeat Test</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <ChevronRight onClick={()=>handleClick(false)}  className="cursor-pointer"/>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Next Test</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Images onClick={()=>handleClick(false)}  className="cursor-pointer"/>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="p-2">Screenshot</p>
        </TooltipContent>
      </Tooltip>
    </div>
    </div>;
}

type Mixed ="scatter"|"line"
ChartJS.register(
  LineController,
  ScatterController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  tooltipChart,
  Legend,
  Title,
);

function ChartRender() {
  const cumulativeInterval = useAtomValue(cumulativeIntervalAtom)
  const selection = useAtomValue(modeAtom)
  const wpmData  = cumulativeInterval.map(s => ({ x: s.interval, y: s.wpm }));
  const rawData  = cumulativeInterval.map(s => ({ x: s.interval, y: s.rawWpm }));
  const errorPts = cumulativeInterval.map(s => ({
    x: s.interval,
    y: s.errors === 0 ? NaN : s.errors
    
  }));
  const titleText = [selection.mode + " " + (selection.mode==="time"?selection.time.toString():selection.words.toString()), selection.language]

  return <div className="w-full h-full">
    <Chart<Mixed, (number | {x: number; y: number})[], number> type="scatter" 
    
    data={{
    datasets: [
      {
        label: 'Raw WPM',
        type: 'line',
        data: rawData,
        borderColor: 'rgba(54,162,235,1)', 
        borderWidth: 2,
        borderDash: [6,4],
        pointStyle: 'triangle',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Avg WPM',
        type: 'line',
        data: wpmData,
        borderColor: 'rgba(134,12,35,1)',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Errors',
        type: 'scatter',
        data: errorPts,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(255,99,132,1)',
        yAxisID: 'y2',
      },
    ],
  }}
  
  options={{
  responsive: true,
  maintainAspectRatio: false,

  interaction: {   // <-- affects both hover + tooltip
    mode: 'x',     // compare all datasets with the same x
    intersect: false,
  },
  plugins: {
    tooltip: {
      mode: 'x',
      intersect: false,
    },
    legend: { position: 'top' },
    title:  { display: true,font: { size: 18, weight: 'bold' }, text: titleText, padding:{bottom:4} },
    subtitle: {display: true,font: { size: 12, weight: 'bold' }, text: selection.language}
  },

  scales: {
    x: {
      type: 'linear',
      min: cumulativeInterval[0].interval,
      max: cumulativeInterval.at(-1)!.interval,
      ticks: {
        stepSize: cumulativeInterval.length <= 30 ? 1 : undefined,
        precision: 0,
      },
      grid: { drawOnChartArea: false },
    },
    y:  {
      beginAtZero: true,
      title: { display: true, text: 'WPM' },
    },
    y2: {
      position: 'right',
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: { stepSize: 1 },
      title: { display: true, text: 'Errors' },
    },
  },
}
}
  
  />
  </div>
}