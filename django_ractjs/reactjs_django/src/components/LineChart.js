import React from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect,useState } from "react";
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from 'chart.js';

const createChart = (canvas, data, options) => {
    return new Chart(canvas, {
      type: 'line',
      data: data,
      options: options,
    });
  };

export default function LineChart({ heading, yaxis, xaxis, data }) {
  const canvasRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (canvasRef.current && chartInstance) {
      chartInstance.destroy();
    }
    if (canvasRef.current) {
      const newChartInstance = createChart(canvasRef.current, data, chartOptions);
      setChartInstance(newChartInstance);
    }
  }, [data, chartOptions]);

  const chartdata = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };



  return (
    <div>
      <h2>Line Chart</h2>
      <Line data={chartdata} options={chartOptions} ref={canvasRef} />
    </div>
  );
}
