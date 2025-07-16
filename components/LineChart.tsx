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
import { useAtom, useAtomValue } from "jotai";
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

export default function LineChart({cumulativeInterval}:{cumulativeInterval:{
    wpm: number;
    rawWpm: number;
    interval: number;
    errors: number;
    problematicKeys:string[]
}[]}) {
  const theme = useAtomValue(themeAtom)
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
              borderColor: theme.backgroundSecondary,
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
              borderColor: theme.primary,
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
              pointBackgroundColor: theme.destructive,
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
