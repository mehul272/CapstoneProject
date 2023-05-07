import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { transformData } from "./Visualize";

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// export default function BarChart({ heading, details }) {
//   console.log("Before: ", details);
//   const transformedData = transformData(details);

//   console.log("finalD: ", transformedData);

//   const chartData = {
//     labels: details.map((item) => item.col11),
//     datasets: [
//       {
//         label: "Values",
//         data: details.map((item) => item.col22),
//         backgroundColor: "rgba(255, 99, 132, 0.6)",
//       },
//     ],
//   };

//   return (
//     <div className="w-50">
//       <Bar
//         data={chartData}
//         options={{
//           scales: {
//             yAxes: [{ ticks: { beginAtZero: true } }],
//           },
//         }}
//       />
//     </div>
//   );
// }

export default function BarChart({ heading, yaxis, xaxis, data }) {

  const filteredColumns = yaxis.concat(xaxis)

  const chartData = {
    labels: data.map((item) => item[yaxis[0]]),
    datasets: filteredColumns.map((column) => ({
      label: column,
      data: data.map((item) => item[column]),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    })),
  };

  const chartOptions = {
    responsive: true,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }],
    },
  };

  return (
    <div className="w-50">
      <div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
