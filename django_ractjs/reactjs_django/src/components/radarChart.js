import React from "react";
import { Line } from "react-chartjs-2";
import { useEffect } from "react";
import { Chart } from "chart.js";
import randomcolor from "randomcolor";

function RadarChart({ heading, yaxis, xaxis, data }) {
  const filteredColumns = yaxis.concat(xaxis);

  const colors = randomcolor({ count: data.length });

  useEffect(() => {
    const radarChartCanvas = document
      .getElementById("radar-chart")
      .getContext("2d");

    new Chart(radarChartCanvas, {
      type: "radar",
      data: {
        labels: data.map((item) => item[yaxis[0]]),
        datasets: filteredColumns.map((column) => ({
          label: column,
          data: data.map((item) => item[column]),
          fill: true,
          backgroundColor: colors,
          borderColor: colors,
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          pointHoverBackgroundColor: colors,
          pointHoverBorderColor: colors,
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
  }, [yaxis, xaxis]);

  return (
    <div>
      <canvas id="radar-chart"></canvas>
    </div>
  );
}

export default RadarChart;
