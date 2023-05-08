import React from "react";
import BarChart from "./Barchat";
import { Line } from "react-chartjs-2";
import ChartSelection from "./chartSelection";
import { useState } from "react";

const Visualize = (tableData) => {

  return (
    <div>
      <h1>Hello</h1>

      <ChartSelection heading={"My Chart"} details={tableData.tableData} />
    </div>
  );
};

export default Visualize;
