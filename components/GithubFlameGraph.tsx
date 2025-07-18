import { themeAtom } from "@/app/store/atoms/theme";
import { useAtomValue, useSetAtom } from "jotai";
import { ActivityCalendar } from "react-activity-calendar";
import tinycolor from "tinycolor2";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  eachDayOfInterval,
  subDays,
  format,
  addDays,
  isSameDay,
  parseISO,
  isEqual,
} from "date-fns";
import axios from "axios";
import { URI } from "@/lib/URI";
import { toast } from "sonner";
import {
  LastYearResult,
  lastYearResultAtom,
} from "@/app/store/atoms/lastYearTest";
import { Zap } from "lucide-react";

const GithubFlameGraph = memo(()=>{
  const today = new Date();
  const from = subDays(today, 364); // 365 days total

  const themeColors = useAtomValue(themeAtom);
  const setLastYearTest = useSetAtom(lastYearResultAtom);
  const [data, setData] = useState(
    eachDayOfInterval({ start: from, end: today }).map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      count: 0,
      level: 0,
    }))
  );
  const lightest = tinycolor(themeColors.primary).lighten(10).toHexString();
  const darkest = tinycolor(themeColors.primary).darken(20).toHexString();
  const scrollRef = useRef<HTMLDivElement>(null);
  const record: Record<string, number> = {};
  useEffect(() => {
    async function getLastYearResults() {
      try {
        const { data: backendData }: { data: { data: LastYearResult } } =
          await axios.get(`${URI}/api/get-lastYearResults`);
        backendData.data.forEach((test) => {
          const dateKey = format(new Date(test.createdAt), "yyyy-MM-dd");
          record[dateKey] = (record[dateKey] || 0) + 1;
        });
        setLastYearTest(backendData.data);
        const resultArr = data.map((data) => {
          const count = record[data.date] || 0;
          return {
            date: data.date,
            count,
            level: count > 1 ? 4 : count,
          };
        });
        setData(resultArr);
      } catch (error) {
        toast.error("Error while fetching data");
      }
    }
    getLastYearResults();
  }, []);
useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth; // scroll to far right
    }
  }, []);

  const { currentStreak, longestStreak } = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;

    let lastDate: Date | null = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i].count > 0) {
        const currentDate = parseISO(data[i].date);

        if (lastDate && isEqual(currentDate, addDays(lastDate, 1))) {
          currentStreak += 1;
        } else {
          currentStreak = 1; // new streak
        }

        longestStreak = Math.max(longestStreak, currentStreak);
        lastDate = currentDate;
      } else {
        currentStreak = 0;
        lastDate = null;
      }
    }

    return { currentStreak, longestStreak };
  }, [data]);
  console.log({ currentStreak, longestStreak });
  return (
    <div
    ref={scrollRef}
    className="w-full overflow-auto flex flex-col items-center justify-center">
      Last 365 days
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-1"><Zap/> <p>Current Streak  : {currentStreak}</p></div>
        <div className="flex gap-1"><Zap/> <p>Longest Streak  : {longestStreak}</p></div>

      </div>
      
      <div className="xl:min-w-[1000px] lg:min-w-[700px] h-fit border-2 border-[var(--secondary)] p-3 rounded-lg">
        <ActivityCalendar
          renderBlock={(block, activity) => (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>{block}</TooltipTrigger>
                <TooltipContent className="text-sm">
                  {activity.count} activities on{" "}
                  {new Date(activity.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          blockMargin={5}
          blockRadius={9}
          blockSize={18}
          loading={false}
          labels={{
            totalCount: `{{count}} tests in last 365 days`,
          }}
          theme={{
            dark: [lightest, darkest],
          }}
          data={data}
        />
      </div>
    </div>
  );
})
export default GithubFlameGraph