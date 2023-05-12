import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import BarChart from "./Barchat";
import PieChart from "./pieChart";
import { Button } from "react-bootstrap";
import LineChart from "./LineChart";
import RadarChart from "./radarChart";
import "../resources/css/chartSelection.css";
import HeaderPart from "./Header";

export function isStringValue(arr, key) {
  for (const obj of arr) {
    const value = obj[key];
    if (typeof value !== "string") {
      return false;
    }
  }
  return true;
}

const VISUALIZATION_TYPES = ["BarChart", "PieChart", "LineChart", "RadarChart"];

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
          <BarChart
            heading={"My Bar Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
          />
        );
      case "PieChart":
        return (
          <PieChart
            heading={"My Pie Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
          />
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
      case "RadarChart":
        return (
          <RadarChart
            heading={"My Radar Chart"}
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
      <div className=" visualize-body">
        <div className="upper-body">
        <>
          {/* <div className="head-visualize">
            <h3 class="animate-charcter"> Let's Visualize</h3>
          </div> */}
            <HeaderPart
        phaseNumber={"4"}
        phaseName={"Visualize"}
        imgSource="https://cdn-icons-png.flaticon.com/512/1700/1700483.png"
      />

          <div className="chart-selection-container">
            <div className="chart-selection">
              <h5 className="headings">Chart Selection</h5>
              <select onChange={(e) => handleCheckForTypes(e, e.target.value)}>
                {VISUALIZATION_TYPES.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="x-axis-selection">
              <h5 className="headings">X-Axis Selection</h5>
              <select onChange={(e) => handleCheckForYaxis(e, e.target.value)}>
                {stringValueCols.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="y-axis-selection">
              <h5 className="headings">Y-Axis Selection</h5>
              <select
                multiple={chartType !== "PieChart"}
                onChange={(e) =>
                  handleCheckForXaxis(
                    e,
                    Array.from(e.target.selectedOptions).map(
                      (option) => option.value
                    )
                  )
                }
              >
                {numericValueCols.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>

        <div className="button-render">
          <button
            onClick={handleButtonClick}
            className="button-33"
            role="button"
          >
            Render Component
          </button>
        </div>
        </div>
        
          {isButtonClicked && renderComponent()}
        
      </div>
    </>
  );
}
