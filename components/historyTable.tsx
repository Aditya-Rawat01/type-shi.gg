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
import {
  BarChart,
  GitGraph,
  LanguagesIcon,
  LucideLanguages,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import ChartRender from "./renderChart";

const HistoryTable = memo(() => {
  const [cursorId, setCursorId] = useState<string | null>(null);
  const [results, setResults] = useState<results>([]);
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
          setResults((prev) => [...prev, ...resultsVal]);
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
  const MemoisedFlameGraph = memo(ChartRender); // to stop flickering while opening the chart
  return (
    <>
      <Table className="w-full sm:w-4/5 bg-amber-300">
        <TableCaption>A list of your recent TableData.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Raw Wpm</TableHead>
            <TableHead className="w-[100px] text-center">Avg Wpm</TableHead>
            <TableHead className="w-[100px] text-center">Accuracy</TableHead>
            <TableHead className="w-[100px] text-center">
              <Tooltip>
                        <TooltipTrigger>
                          <p>
                            CharSets
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="p-2 text-base">correct / incorrect / missed / extra</p>
                        </TooltipContent>
                      </Tooltip>
            </TableHead>
            <TableHead className="w-[100px] text-center">Mode</TableHead>
            <TableHead className="w-[100px] text-center">Details</TableHead>
            <TableHead className="w-[100px] text-center">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length > 0 ? (
            results.map((test, index) => (
              <TableRow key={index}>
                <TableCell>{test.rawWpm}</TableCell>
                <TableCell>{test.avgWpm}</TableCell>
                <TableCell>{test.accuracy + "%"}</TableCell>
                <TableCell>{test.charSets[0] + "/" + test.charSets[1] + "/" + test.charSets[2] + "/" + test.charSets[3]}</TableCell>
                <TableCell className="">{test.mode}</TableCell>
                <TableCell>
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
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <p><BarChart/></p>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent side="top">Graph</TooltipContent>
        </Tooltip>
          <DialogContent className="sm:max-w-[720px] h-[460px] flex flex-col gap-5 justify-center">
              <DialogTitle>Flame Graph</DialogTitle>
          <MemoisedFlameGraph cumulativeInterval={test.flameGraph}/>
          </DialogContent>
      </Dialog>
    </TooltipProvider>
                    </div>
                  }
                </TableCell>
                <TableCell className="">
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
          <TableRow>
            {results.length > 5 && cursorId && (
              <TableCell colSpan={8}>
                <Button
                  className={`h-[36px] w-[107.14px] cursor-pointer`}
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

      {/* <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </>
  );
});

export default HistoryTable;
