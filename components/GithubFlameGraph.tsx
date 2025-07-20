import { themeAtom } from "@/app/store/atoms/theme";
import { useAtomValue, useSetAtom } from "jotai";
import { ActivityCalendar } from "react-activity-calendar";
import tinycolor from "tinycolor2";
import React, { cloneElement, memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
const GithubFlameGraph = memo(
  ({
    data,
  }: {
    data: {
      date: string;
      count: number;
      level: number;
    }[];
  }) => {
    const themeColors = useAtomValue(themeAtom);

    const lightest = tinycolor(themeColors.primary).toHexString();
    const darkest = tinycolor(themeColors.primary).darken(80).toHexString();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollLeft = el.scrollWidth; // scroll to far right
      }
    }, []);
    return (
      <div
        ref={scrollRef}
        className="w-full xl:w-[1100px] flex flex-col items-center justify-center"
      >
        Last 365 days
        <div className="w-full flex items-center justify-center h-fit border-2 border-[var(--secondary)] p-3 rounded-lg overflow-x-scroll sm:overflow-hidden">
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
            blockMargin={4}
            blockSize={16}
            blockRadius={8}
            loading={false}
            labels={{
              totalCount: `{{count}} tests in last 365 days`,
            }}
            theme={{
              dark: [lightest, darkest],
            }}
            data={data}
            renderColorLegend={(block, level) => {
            return (
              cloneElement(block, {
              rx: 2,
              ry: 2,
              width:18,
              height:18
            })
            )
          }}
          />
        </div>
      </div>
    );
  }
);
export default GithubFlameGraph;
