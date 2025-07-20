import { userCookie } from "@/app/store/atoms/userCookie";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useEffect, useMemo, useState } from "react";
import GithubFlameGraph from "./GithubFlameGraph";
import { addDays, eachDayOfInterval, format, isEqual, parseISO, subDays } from "date-fns";
import axios from "axios";
import { URI } from "@/lib/URI";
import { toast } from "sonner";
import {
  LastYearResult,
  lastYearResultAtom,
} from "@/app/store/atoms/lastYearTest";
import { Zap } from "lucide-react";

const About = memo(() => {
  const today = new Date();
  const from = subDays(today, 364); // 365 days total

  const record: Record<string, number> = {};
  const setLastYearTest = useSetAtom(lastYearResultAtom);
  const [data, setData] = useState(
    eachDayOfInterval({ start: from, end: today }).map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      count: 0,
      level: 0,
    }))
  );
  const cookie = useAtomValue(userCookie);
  let account = "";
  if (!cookie) {
    account = "Sign up/in";
  } else if (cookie?.user.name) {
    account = cookie?.user.name;
  } else if (cookie?.user.email) {
    account = cookie?.user.name;
  } else {
    account = "placeholder";
  }

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
            level: count > 4 ? 4 : count,
          };
        });
        setData(resultArr);
      } catch (error) {
        toast.error("Error while fetching data");
      }
    }
    getLastYearResults();
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
  return (
    <div className="w-full sm:w-4/5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between px-3 text-xs sm:text-base">
      <div className="flex flex-col items-start gap-2">
              <div className="flex gap-1"><Zap className="fill-[var(--backgroundSecondary)]"/> <p>Current Streak  : {currentStreak}</p></div>
              <div className="flex gap-1"><Zap/> <p>Longest Streak  : {longestStreak}</p></div>
      
      </div>
      <div className="flex flex-col">
      <p>{account}</p>
      <p>Joined on: 12 may 2025</p>
      </div>
      </div>
      <GithubFlameGraph data={data}/>
    </div>
  );
});

export default About;
