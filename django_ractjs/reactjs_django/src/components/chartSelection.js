import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import BarChart from "./Barchat";
import PieChart from "./pieChart";
import { Button } from "react-bootstrap";
import LineChart from "./LineChart";
import RadarChart from "./radarChart";
import "../resources/css/chartSelection.css";
import HeaderPart from "./Header";
import canvasToImage from "canvas-to-image";

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

  const [canvasDownload, setCanvasDownload] = useState({});

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

  // const handleCheckForYaxis = (event, option) => {
  //   setYaxis([option]);
  // };

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

  const handleDownload = () => {
    canvasToImage(canvasDownload, {
      name: "chart",
      type: "jpg",
      quality: 1,
      backgroundColor: "#ffffff",
      cssRules: "border: 1px solid black;",
    });
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
            updateCanvas={(value) => setCanvasDownload(value)}
          />
        );
      case "PieChart":
        return (
          <PieChart
            heading={"My Pie Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
            updateCanvas={(value) => setCanvasDownload(value)}
          />
        );
      case "LineChart":
        return (
          <LineChart
            heading={"My Line Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
            updateCanvas={(value) => setCanvasDownload(value)}
          />
        );
      case "RadarChart":
        return (
          <RadarChart
            heading={"My Radar Chart"}
            yaxis={yaxis}
            xaxis={xaxis}
            data={details}
            updateCanvas={(value) => setCanvasDownload(value)}
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

        {isButtonClicked ? (
          <button onClick={handleDownload}>Download chart</button>
        ) : null}
      </div>
    </>
  );
}
