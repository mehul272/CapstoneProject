import React from "react";
import BarChart from "./Barchat";
import { Line } from "react-chartjs-2";
import ChartSelection from "./chartSelection"

export const transformData = (inputData) => {
  const labels = [];
  const data = [];
  inputData.forEach((row) => {
    Object.keys(row).forEach((column) => {
      if (!labels.includes(column)) {
        labels.push(column);
      }
    });
  });

  inputData.forEach((row) => {
    const rowData = [];

    labels.forEach((column) => {
      if (row.hasOwnProperty(column)) {
        rowData.push(row[column]);
      } else {
        rowData.push(null);
      }
    });

    data.push(rowData);
  });

  return {
    labels,
    data,
  };
};

const Visualize = (tableData) => {
  console.log("Final: ", tableData);

  const transformedData = transformData(tableData.tableData);

  return (
    <div>
      <h1>Hello</h1>

      <ChartSelection heading={"My Chart"} details={tableData.tableData}/>

    </div>
  );
};

export default Visualize;
