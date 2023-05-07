import React from "react";
import { useEffect } from "react";
import { Chart } from "chart.js";
import randomcolor from "randomcolor";

function PolarAreaChart({ heading, yaxis, xaxis, data }) {
  const filteredColumns = yaxis.concat(xaxis);

  const colors = randomcolor({ count: data.length });

  useEffect(() => {
    const polarChartCanvas = document
      .getElementById("polar-chart")
      .getContext("2d");

    new Chart(polarChartCanvas, {
      type: "polarArea ",
      data: {
        labels: data.map((item) => item[yaxis[0]]),
        datasets: filteredColumns.map((column) => ({
          label: column,
          data: data.map((item) => item[column]),
          fill: true,
          backgroundColor: colors,
          borderColor: colors,
        })),
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 20,
          },
        },
        canvas: {
          height: 400,
          width: 400,
        },
      },
    });
  }, [yaxis, xaxis]);

  return (
    <div>
      <canvas id="polar-chart"></canvas>
    </div>
  );
}

export default PolarAreaChart;
