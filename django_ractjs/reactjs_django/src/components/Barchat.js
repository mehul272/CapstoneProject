import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect } from "react";
import { Chart } from "chart.js";
import randomcolor from "randomcolor";

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ heading, yaxis, xaxis, data }) {

  const filteredColumns = yaxis.concat(xaxis);

  const colors = randomcolor({ count: data.length });

  useEffect(() => {
    const barChartCanvas = document
      .getElementById("bar-chart")
      .getContext("2d");

    new Chart(barChartCanvas, {
      type: "bar",
      data: {
        labels: data.map((item) => item[yaxis[0]]),
        datasets: filteredColumns.map((column) => ({
          label: column,
          data: data.map((item) => item[column]),
          backgroundColor: colors,
        })),
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        canvas: {
          height: 800,
          width: 800,
        },
      },
    });
  }, [yaxis,xaxis]);

  return (
    <div className="w-50">
      <div>
        <canvas id="bar-chart"></canvas>
      </div>
    </div>
  );
}
