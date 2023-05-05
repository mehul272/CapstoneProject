import React from "react";
import { Pie } from 'react-chartjs-2';

function PieChart({ heading, yaxis, xaxis, data }) {
  const filteredColumns = yaxis.concat(xaxis);

  const chartData = {
    labels: ['Mehul','Meh','Ul','Hi'],
    datasets: filteredColumns.map((column) => ({
      data: [400, 300, 300, 200],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div>
      <h2>Pie Chart</h2>
      <Pie data={chartData} options={chartOptions}  />
    </div>
  );
}

export default PieChart;
