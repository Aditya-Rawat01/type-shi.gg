import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { results } from "./profilePage";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { URI } from "@/lib/URI";
import { toast } from "sonner";
import { Button } from "./ui/button";
import "./components.css";
import { BarChart, LucideLanguages, SpellCheck2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { resultsAtom } from "@/app/store/atoms/resultAtom";
import { useAtom, useSetAtom } from "jotai";
import LineChart from "./LineChart";
import { DialogClose } from "@radix-ui/react-dialog";

const HistoryTable = memo(() => {
  const [cursorId, setCursorId] = useState<string | null>(null);
  const [results, setResults] = useAtom(resultsAtom);
  const [reccurringResults, setReccuringResults] = useState<results>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [refresh, setRefresh] = useState(1); // random value to hold as if changing this value in useEffect will cause another useEffect to run 2 times
  useEffect(() => {
    async function LoadResults() {
      try {
        const query = cursorId ? `?cursorId=${cursorId}` : "";
        const res: { data: { data: results } } = await axios.get(
          `${URI}/api/getResults${query}`,
          {
            params: {
              cursorId: cursorId,
            },
          }
        );
        const resultsVal = res.data.data;
        console.log({ resultsVal });
        setTimeout(() => {
          results.length == 0
            ? setResults((prev) => [...prev, ...resultsVal])
            : null;
          setReccuringResults((prev) => [...prev, ...resultsVal]);
          setCursorId(
            resultsVal.length > 0 ? resultsVal[resultsVal.length - 1].id : null
          );
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error(error as string);
      }
    }

    setTimeout(() => {
      setIsFetching(false);
    }, 500);
    LoadResults();
  }, [refresh]);
  async function handleRefresh() {
    if (isFetching) return; // redundant.
    console.log(cursorId);
    setIsFetching(true);
    setRefresh(Date.now());
  }
  const MemoisedFlameGraph = memo(LineChart); // to stop flickering while opening the chart
  return (
    <div className="w-full h-fit">
      <div className="text-3xl">History</div>
      <Table className="w-5/6 sm:w-4/5 outline outline-[var(--secondary)] mt-3 hover:overflow-y-hidden h-fit overflow-y-hidden overflow-x-scroll mb-3 rounded-md bg-white/10">
      
        <TableHeader className="">
          <TableRow className="">
            <TableHead className="w-[100px] text-center text-var(--text)">Raw Wpm</TableHead>
            <TableHead className="w-[100px] text-center text-var(--text)">Avg Wpm</TableHead>
            <TableHead className="w-[100px] text-center text-var(--text)">Accuracy</TableHead>
            <TableHead className="w-[100px] text-center text-var(--text) hidden sm:table-cell">
              <Tooltip>
                <TooltipTrigger>
                  <p>CharSets</p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="p-2 text-base">
                    correct / incorrect / missed / extra
                  </p>
                </TooltipContent>
              </Tooltip>
            </TableHead>
            <TableHead className="w-[100px] text-center hidden sm:table-cell text-var(--text)">Mode</TableHead>
            <TableHead className="w-[100px] text-center hidden sm:table-cell text-var(--text)">Details</TableHead>
            <TableHead className="w-[100px] text-center hidden sm:table-cell text-var(--text)">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reccurringResults.length > 0 ? (
            reccurringResults.map((test, index) => (
              <TableRow key={index}>
                <TableCell>{test.rawWpm}</TableCell>
                <TableCell>{test.avgWpm}</TableCell>
                <TableCell>{test.accuracy + "%"}</TableCell>
                <TableCell className=" hidden sm:table-cell">
                  {test.charSets[0] +
                    "/" +
                    test.charSets[1] +
                    "/" +
                    test.charSets[2] +
                    "/" +
                    test.charSets[3]}
                </TableCell>
                <TableCell className=" hidden sm:table-cell">{test.mode}</TableCell>
                <TableCell className=" hidden sm:table-cell">
                  {
                    <div className="flex gap-3 justify-center">
                      <Tooltip>
                        <TooltipTrigger>
                          <p>
                            <LucideLanguages />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="p-2">{test.language}</p>
                        </TooltipContent>
                      </Tooltip>

                      <TooltipProvider delayDuration={300}>
                        <Dialog modal={false}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <p>
                                  <BarChart />
                                </p>
                              </DialogTrigger>
                            </TooltipTrigger>

                            <TooltipContent side="top">Graph</TooltipContent>
                          </Tooltip>
                          <DialogClose asChild>
                            <DialogContent className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 w-screen h-screen rounded-none translate-x-0 translate-y-0">
                              <div className="bg-[var(--background)] text-[var(--text)] sm:w-2/3 h-1/2 flex flex-col gap-5 justify-center rounded-2xl">
                                <DialogTitle>Flame Graph</DialogTitle>
                                <MemoisedFlameGraph
                                  cumulativeInterval={test.flameGraph}
                                />
                              </div>
                            </DialogContent>
                          </DialogClose>
                        </Dialog>
                      </TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <p>
                            <SpellCheck2 />
                          </p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="flex gap-1 items-center"
                        >
                          Top Problematic keys:
                          <div className="flex p-1">
                            {" "}
                            {getProblematicKeys(test.flameGraph).length > 0
                              ? getProblematicKeys(test.flameGraph).join(", ")
                              : "none"}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  }
                </TableCell>
                <TableCell className=" hidden sm:table-cell">
                  {
                    <>
                      <p>{new Date(test.createdAt).toLocaleTimeString()}</p>
                      <p>{new Date(test.createdAt).toDateString()}</p>
                    </>
                  }
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>No results to show</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="bg-[var(--backgroundSecondary)]">
            {reccurringResults.length > 5 && cursorId && (
              <TableCell colSpan={8}>
                <Button
                  className={`h-[36px] w-[107.14px] text-[var(--text)] bg-[var(--background)] hover:bg-[var(--background)] outline-2 shadow-lg outline-[var(--background)]/40 p-2 rounded-lg cursor-pointer`}
                  disabled={isFetching}
                  onClick={handleRefresh}
                >
                  {!isFetching ? (
                    <span>Load More</span>
                  ) : (
                    <span className="loader2"></span>
                  )}
                </Button>
              </TableCell>
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
});

export default HistoryTable;

function getProblematicKeys(
  cumulativeInterval: {
    wpm: number;
    rawWpm: number;
    interval: number;
    errors: number;
    problematicKeys: string[];
  }[]
) {
  const allKeys = cumulativeInterval.reduce<string[]>((acc, curr) => {
    acc.push(...curr.problematicKeys);
    return acc;
  }, []);

  // to count frequency
  const freq: Record<string, number> = {};
  for (const k of allKeys) {
    freq[k] = (freq[k] ?? 0) + 1;
  }
  // sort
  const desc = Object.entries(freq)
    .sort(([, aCount], [, bCount]) => bCount - aCount) // ← sort here
    .map(([key, count]) => ({ [key]: count }));
  return desc.slice(0, 3).map((obj) => Object.keys(obj)[0]);
}
