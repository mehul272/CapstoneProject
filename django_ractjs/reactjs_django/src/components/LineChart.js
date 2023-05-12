import React from "react";
import { Line } from "react-chartjs-2";
import { useEffect } from "react";
import { Chart } from "chart.js";
import randomcolor from "randomcolor";
import "../resources/css/AllFourCharts.css";

function LineChart({ heading, yaxis, xaxis, data }) {
  const filteredColumns = yaxis.concat(xaxis);

  const colors = randomcolor({ count: data.length });


  useEffect(() => {
    const lineChartCanvas = document
      .getElementById("line-chart")
      .getContext("2d");

    new Chart(lineChartCanvas, {
      type: "line",
      data: {
        labels: data.map((item) => item[yaxis[0]]),
        datasets: filteredColumns.map((column) => ({
          label: column,
          data: data.map((item) => item[column]),
          fill: false,
          borderColor: colors,
          tension: 0.1,
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
    <div className="four-chart">
      <canvas id="line-chart"></canvas>
    </div>
  );
}

export default LineChart;
