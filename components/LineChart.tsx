import { themeAtom } from "@/app/store/atoms/theme";
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
import { useAtomValue } from "jotai";
import { Chart } from "react-chartjs-2";

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

export default function LineChart({
  cumulativeInterval,
}: {
  cumulativeInterval: {
    wpm: number;
    rawWpm: number;
    interval: number;
    errors: number;
    problematicKeys: string[];
  }[];
}) {
  const theme = useAtomValue(themeAtom);
  const wpmData = cumulativeInterval.map((s) => ({ x: s.interval, y: s.wpm }));
  const rawData = cumulativeInterval.map((s) => ({
    x: s.interval,
    y: s.rawWpm,
  }));
  const errorPts = cumulativeInterval.map((s) => ({
    x: s.interval,
    y: s.errors,
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
              borderColor: theme.secondary,
              borderWidth: 2,
              tension: 0.4,
              yAxisID: "y",
              clip: false,
              backgroundColor: theme.secondary
              
            },
            {
              label: "Avg WPM",
              type: "line",
              data: wpmData,
              borderColor: theme.primary,
              borderWidth: 2,
              tension: 0.3,
              yAxisID: "y",
              clip: false,
              fill:false,
              backgroundColor:theme.primary
            },
            {
              label: "Errors",
              type: "scatter",
              data: errorPts,
              pointStyle: "crossRot",
              fill:false,
              pointBorderColor: theme.destructive,
              pointBorderWidth: 2,
              pointBackgroundColor: theme.destructive,
              pointRadius: (ctx) => {
                const val = ctx.raw as { x: number; y: number };
                console.log({val})
                return ( typeof(val)=="undefined" || val.y==0 ) ? 0 : 7;
              },
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
            legend: { 
              position: "top",
              labels: {
                color: theme.text
              }
            },
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
                color: theme.text 
              },
            },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 20, color: theme.text },
              title: { display: true, text: "WPM", color: theme.text },
            },
            y2: {
              position: "right",
              beginAtZero: true,
              grid: { drawOnChartArea: false },
              suggestedMax: 5,
              ticks: { stepSize: 1, color: theme.text  },
              title: { display: true, text: "Errors", color: theme.text  },
            },
          },
        }}
      />
    </div>
  );
}
