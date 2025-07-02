import {
  restartSameTestAtom,
  shadowTestAtom,
} from "@/app/store/atoms/restartSameTest";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRight, Images, ListRestart, RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toBlob } from "html-to-image";
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
import { userCookie } from "@/app/store/atoms/userCookie";
import { useRouter } from "next/navigation";
export default function ResultPage({
  setShowResultPage,
  charArray,
}: {
  setShowResultPage: Dispatch<SetStateAction<boolean>>;
  charArray: number[];
}) {
  const [repeatedTest, setRestartSameTest] = useAtom(restartSameTestAtom);
  const shadowRepeatedRef = useRef(repeatedTest); // this helps in removing the flicker of change in flag of repeated test.
  const selection = useAtomValue(modeAtom);
  const isAfk = useAtomValue(afkAtom);
  const hash = useAtomValue(hashAtom);
  const cumulativeInterval = useAtomValue(cumulativeIntervalAtom);
  const errors = cumulativeInterval.reduce((acc,curr)=>acc+curr.errors,0)
  const totalChars = charArray[0] + charArray[1] + charArray[2] + charArray[3]
  const correctChars = charArray[0]
  const accuracy= (correctChars>0 && totalChars>0)?(totalChars-errors)*100/totalChars:0
  const rawWpm = cumulativeInterval.length>0?cumulativeInterval[cumulativeInterval.length-1].rawWpm:0
  const avgWpm = cumulativeInterval.length>0?cumulativeInterval[cumulativeInterval.length-1].wpm:0
  const cookie = useAtomValue(userCookie)
  //const [s,setCompletedTestBeforeSignIn] = useAtom(completedTestBeforeSignedInAtom)
  const router = useRouter() // prevents full page refresh due to which the atom persist value between page renders
  // send the data to backend.
  // send the [correct, incorrect, missed, extra]
  // send the accuracy (once done)
  // send the raw and avg wpm
  // send the {generatedHash, initialseed, generationAmt}
  // send some particular identifier to know the person.
  // user table id or userId is going to be the identifier.
  useEffect(() => {
    if ((isAfk) && cookie) {
      toast.warning("Invalid test, Test will not be stored.");
      return;
    }
    if (repeatedTest && cookie) {
      toast.warning("Repeated test, Test will not be stored.");
      return;
    }
    
    async function dataSender() {
      if (accuracy<36 || !rawWpm || !avgWpm) {
        toast.error("Invalid test!")
        return
      }
      const mode2 =
        selection.mode === "words" ? selection.words : selection.time;
      const body = {
        charSets: charArray, // correct, incorrect, extra, missed
        mode: selection.mode,
        mode2: mode2,
        flameGraph: cumulativeInterval,
        accuracy: accuracy, // hardcoded for a while.
        rawWpm: parseFloat(rawWpm.toFixed(2)),
        avgWpm: parseFloat(avgWpm.toFixed(2)),
        language: selection.language,
        // these will not be saved.
        initialSeed: hash.originalSeed,
        generatedAmt: hash.GeneratedAmt,
        finalHash: hash.hash,
      };
      try {
        if (!cookie) {
          try {
            const data=await axios.post(`${URI}/api/tempTest`, body)
            const stringifiedVersion:string = data.data.token
            localStorage.setItem("token",stringifiedVersion)
          } catch (error) {
            toast.error("Error occurred! Tampered Fields!")
          }
          return
      }
        const res = await axios.post(`${URI}/api/test`, body);
        toast.success(res.data.msg);
      } catch (error) {
        toast.warning("some fields are missing/tampered");
      }
    }
    dataSender();
  }, []);
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
  const charArrayRepresentation = charArray[0]+" / "+charArray[1]+" / "+charArray[2]+" / "+charArray[3]
  const captureRef = useRef<HTMLDivElement>(null);

  // take ss after some ms so to avoid any jitter or lag in ui.
  const handleScreenshot = ()=>setTimeout(async()=>
      {const ss = captureRef.current;
        if (!ss) return
    const blob = await toBlob(ss, { pixelRatio: 2 });
    if (!blob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      toast.success("Screenshot copied 🎉");
    } catch (err) {
      // Safari & older Firefox can’t write blobs → fallback download// new thig to learn.
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: "capture.png"
      });
      a.click();
      toast.info("Clipboard not supported – downloaded instead");
      URL.revokeObjectURL(url);
    }},100)

  return (
    <div className="w-full h-full flex flex-col items-center justify-start pt-12 gap-3 bg-red-300"
    ref={captureRef}>
      <div className="w-full flex flex-col gap-1">
      <div className="wpms w-full flex h-20 bg-green-500 items-center text-md sm:text-2xl justify-around text-lg">
        <div>
          <Tooltip>
          <TooltipTrigger>
            <p>{avgWpm?Math.round(rawWpm):"-"}</p>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="p-2">{rawWpm.toFixed(2)}</p>
          </TooltipContent>
        </Tooltip>
        <p>Raw wpm</p>
        </div>
        <div>
          <Tooltip>
          <TooltipTrigger>
            <p>{avgWpm?Math.round(avgWpm):"-"}</p>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="p-2">{avgWpm.toFixed(2)}</p>
          </TooltipContent>
        </Tooltip>
          
        <p>Avg wpm</p>
        </div>
        <div>
          <Tooltip>
          <TooltipTrigger>
            <p>{accuracy?Math.round(accuracy)+"%":"-"}</p>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="p-2">{accuracy.toFixed(2)}</p>
          </TooltipContent>
        </Tooltip>
          
        <p>Accuracy</p>
        </div>
      </div>
      <div className="bg-red-600 text-2xl flex justify-center w-full mt-0">
          <Tooltip>
          <TooltipTrigger>
            {charArrayRepresentation}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="p-2 text-lg">Correct / Incorrect / Missed / Extra</p>
          </TooltipContent>
        </Tooltip>
        </div>
        </div>
      <div className="graph h-80 bg-orange-400 w-4/5 flex flex-col">
        <div className="text-xl pl-10 relative">
          <p>{titleText[0]}</p>
          <p>{titleText[1]}</p>
          {shadowRepeatedRef.current ? (
            <p className="absolute top-2 right-10 rounded-2xl bg-red-700 px-3 py-2 text-white">
              Repeated Test
            </p>
          ) : null}
          {isAfk ? (
            <p className="absolute top-2 left-1/2 -translate-x-1/2 rounded-2xl bg-violet-700 px-3 py-2 text-white">
              Afk detected (ㆆ_ㆆ)
            </p>
          ) : null}
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
              onClick={handleScreenshot}
              className="cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="p-2">Screenshot</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {!cookie && <p> <span className="underline cursor-pointer" onClick={()=>router.push("/login")}>Sign in</span> to save the result</p>}
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
              clip: false,
            },
            {
              label: "Avg WPM",
              type: "line",
              data: wpmData,
              borderColor: "rgba(134,12,35,1)",
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y",
              clip: false,
            },
            {
              label: "Errors",
              type: "scatter",
              data: errorPts,
              pointRadius: 5,
              pointBackgroundColor: "rgba(255,99,132,1)",
              yAxisID: "y2",
              clip: false,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          interaction: {
            mode: "x",
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
