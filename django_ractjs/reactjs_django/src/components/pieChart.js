import React from "react";
import { Pie } from "react-chartjs-2";
import { useEffect } from "react";
import { Chart } from "chart.js";
import randomcolor from "randomcolor";
import "../resources/css/AllFourCharts.css";

function PieChart({ heading, yaxis, xaxis, data, updateCanvas }) {
  const filteredColumns = yaxis.concat(xaxis[0]);

  const colors = randomcolor({ count: data.length });

  useEffect(() => {
    const pieChartCanvas = document
      .getElementById("pie-chart")
      .getContext("2d");

    const chart = new Chart(pieChartCanvas, {
      type: "pie",
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
    updateCanvas(chart.canvas);
  }, [yaxis, xaxis]);

  return (
    <div className="four-chart">
      <canvas id="pie-chart"></canvas>
    </div>
  );
}

export default PieChart;
