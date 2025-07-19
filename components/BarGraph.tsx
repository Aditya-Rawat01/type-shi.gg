import { themeAtom } from "@/app/store/atoms/theme";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { useAtomValue } from "jotai";
import { memo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
);

import { Bar } from "react-chartjs-2";

const BarGraph = memo(
  ({
    graphData,
  }: {
    graphData: {
      [x: string]: number;
    }[];
  }) => {
    const labels: string[] = graphData.map((o) => Object.keys(o)[0]);
    const values: number[] = graphData.map((o) => Object.values(o)[0]);
    const theme = useAtomValue(themeAtom);
    const data: ChartData<"bar"> = {
      labels,
      datasets: [
        {
          label: "Problematic Keys",
          data: values,
          borderColor: theme.primary,
          backgroundColor: theme.primary,
          borderWidth: 1,
        },
      ],
    };
    const options: ChartOptions<"bar"> = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: theme.text,
          },
        },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          reverse: true, // ← draw labels right-to-left
          ticks: { color: theme.text }
        },
        y: {
          beginAtZero: true,
          ticks: { color: theme.text, stepSize: 1 }
        },
      },
    };
    return (
      <div className="w-full h-3/4">
        <Bar data={data} options={options} />
      </div>
    );
  }
);
export default BarGraph;
