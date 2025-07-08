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


export default function ChangeLineChart({accuracy, rawWpm, avgWpm}:{accuracy:number[], rawWpm:number[], avgWpm:number[]}) {
    const labels = [1,2,3,4,5,6,7,8,9,10]
    let maxRawWpm = rawWpm[0] || 0
    rawWpm.forEach((index)=>{
        if (index>maxRawWpm) {
            maxRawWpm = index
        }
    })
    const data:ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Raw WPM",
        data: rawWpm.reverse(),
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.1)",
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "wpm",
        clip: false
      },
      {
        label: "Avg WPM",
        data: avgWpm.reverse(),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.1)",
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "wpm",
        clip: false
      },
      {
        label: "Accuracy (%)",
        data: accuracy.reverse(),
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.15)",
        tension: 0.25,
        pointRadius: 4,
        yAxisID: "acc",
        clip: false
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: { mode: "index", intersect: false },
      legend: { position: "top" as const },
    },
    scales: {
      x: { grid: { drawOnChartArea: false } },
      wpm: {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        max: maxRawWpm + 10, 
        title: { display: true, text: "WPM" },
      },
      acc: {
        reverse:true,
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Accuracy (%)" },
      },
    },
  };

 
    return (
         <div className="w-full h-3/4">
                    <Line
                    data={data}
                    options={options}
                    />
        </div>
    )
}