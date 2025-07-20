import { themeAtom } from "@/app/store/atoms/theme";
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { useAtomValue } from "jotai";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ChangeLineChart({
  accuracy,
  rawWpm,
  avgWpm,
}: {
  accuracy: number[];
  rawWpm: number[];
  avgWpm: number[];
}) {
  const theme = useAtomValue(themeAtom);
  const labels: number[] = rawWpm.map((index, num) => {
    return num + 1;
  });
  let maxRawWpm = rawWpm[0] || 0;
  rawWpm.forEach((index) => {
    if (index > maxRawWpm) {
      maxRawWpm = index;
    }
  });
  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Raw WPM",
        data: rawWpm,
        borderColor: theme.secondary,
        backgroundColor: theme.secondary,
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "wpm",
        clip: false,
      },
      {
        label: "Avg WPM",
        data: avgWpm,
        borderColor: theme.primary,
        backgroundColor: theme.primary,
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "wpm",
        clip: false,
      },
      {
        label: "Accuracy (%)",
        data: accuracy,
        borderColor: theme.text,
        backgroundColor: theme.text,
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "acc",
        clip: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: {
        position: "top" as const,
        labels: {
          color: theme.text,
        },
      },
    },
    scales: {
      x: { grid: { drawOnChartArea: false }, ticks: {color: theme.text } },
      wpm: {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        max: Math.round(maxRawWpm) + 10,
        title: { display: true, text: "WPM" },
        ticks: {color: theme.text }
      },
      acc: {
        reverse: true,
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Accuracy (%)" },
        ticks: {color: theme.text }
      },
    },
  };

  return (
    <div className="w-full h-3/4">
      <Line data={data} options={options} />
    </div>
  );
}
