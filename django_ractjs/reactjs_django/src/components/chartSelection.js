import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import BarChart from "./Barchat";
import PieChart from "./pieChart";
import { Button } from "react-bootstrap";
import LineChart from "./LineChart";

function isStringValue(arr, key) {
  for (const obj of arr) {
    const value = obj[key];
    if (typeof value !== "string") {
      return false;
    }
  }
  return true;
}

function conversion(labels, values) {
  const data = labels.map((label) => {
    return values.map((item) => item[label]);
  });

  return data;
}

const VISUALIZATION_TYPES = ["BarChart", "PieChart", "LineChart"];

export default function ChartSelection({ heading, details }) {
  const columns = Object.keys(details[0]);

  const [xaxis, setXaxis] = useState([]);
  const [yaxis, setYaxis] = useState([]);
  const [chartType, setChartType] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const filteredColumns = columns.filter((column) => column !== "id");

  const stringValueCols = filteredColumns.filter((col) =>
    isStringValue(details, col)
  );
  const numericValueCols = filteredColumns.filter(
    (col) => !isStringValue(details, col)
  );

  const handleCheckForTypes = (event, option) => {
    setChartType(option);
  };

  const handleCheckForYaxis = (event, option) => {
    setYaxis([option]);
  };

  let filteredValues = details.filter((item) => {
    let keysArr = Object.keys(item);
    return xaxis.every((key) => keysArr.includes(key));
  });

  const data = xaxis.map((label) => {
    return filteredValues.map((item) => item[label]);
  });

  console.log("Data: ", data);

  const handleCheckForXaxis = (event, option) => {
    const isChecked = event.target.checked;
    const updatedFilters = [...xaxis];
    if (isChecked) {
      updatedFilters.push(option);
    } else {
      const index = updatedFilters.indexOf(option);
      if (index !== -1) {
        updatedFilters.splice(index, 1);
      }
    }

    setXaxis(updatedFilters);
  };

  const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  const renderComponent = () => {
    switch (chartType) {
      case "BarChart":
        return (
          <BarChart heading={"My Bar Chart"} yaxis={yaxis} xaxis={xaxis} data={details} />
        );
      case "PieChart":
        return (
          <PieChart heading={"My Pie Chart"} yaxis={yaxis} xaxis={xaxis} data={details} />
        );
      case "LineChart":
        return (
          <LineChart
            heading={"My Line Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-50">
        <>
          <h1>Chart Selection</h1>
          {VISUALIZATION_TYPES.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name="table1"
                onChange={(e) => handleCheckForTypes(e, option)}
              />
              {option}
            </div>
          ))}

          <h1>Y-Axes Selection</h1>
          {stringValueCols.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name="table"
                onChange={(e) => handleCheckForYaxis(e, option)}
              />
              {option}
            </div>
          ))}
          <br></br>
          <h1>X-Axes Selection</h1>
          {numericValueCols.map((option, index) => (
            <div key={index}>
              {chartType === "PieChart" ? (
                <input
                  type="radio"
                  name="table1"
                  onChange={(e) => handleCheckForXaxis(e, option)}
                />
              ) : (
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckForXaxis(e, option)}
                />
              )}

              {option}
            </div>
          ))}
        </>
        <button onClick={handleButtonClick}>Render Component</button>
        {isButtonClicked && renderComponent()}
      </div>
    </>
  );
}
