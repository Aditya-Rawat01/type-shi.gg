import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { memo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
);

import { Bar } from 'react-chartjs-2';

const BarGraph = ({graphData}:{graphData: {
    [x: string]: number;
}[]})=>{
    const labels: string[] = graphData.map(o => Object.keys(o)[0]);
    const values: number[] = graphData.map(o => Object.values(o)[0]);
    
  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Problematic Keys",
        data: values,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      reverse: true,   // ← draw labels right-to-left
    },
    y: {
      beginAtZero: true,
    },
  },
};
    return (
        <div className="w-full h-3/4">
            <Bar
            data={data}
            options={options}
            />


        </div>
    )
}
export default BarGraph