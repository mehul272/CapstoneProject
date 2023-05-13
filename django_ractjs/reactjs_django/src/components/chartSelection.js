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
      <HeaderPart
        phaseNumber={"4"}
        phaseName={"Visualize"}
        imgSource="https://cdn-icons-png.flaticon.com/512/1700/1700483.png"
      />

      <div className="container-body">
        <>
          <div class="my-div">
            <div class="custom-options">
              <div className="part1">
                <h4 className="headings">Chart Selection</h4>
                {VISUALIZATION_TYPES.map((option, index) => (
                  <div key={index} className="chart-custom-options">
                    <input
                      type="radio"
                      name="table1"
                      onChange={(e) => handleCheckForTypes(e, option)}
                      className="radio-button custom-radio"
                    />
                    <label for="outline">{option}</label>
                  </div>
                ))}
              </div>

              <div className="part2">
                <h4 className="headings">X-Axis Selection</h4>
                {stringValueCols.map((option, index) => (
                  <div key={index} className="x-custom-options">
                    <input
                      type="radio"
                      name="table"
                      onChange={(e) => handleCheckForYaxis(e, option)}
                      className="radio-button custom-radio"
                    />
                    <label for="outline">{option}</label>
                  </div>
                ))}
              </div>
              <div className="part3">
                <h4 className="headings">Y-Axis Selection</h4>
                {numericValueCols.map((option, index) => (
                  <div key={index} className="y-custom-options">
                    {chartType === "PieChart" ? (
                      <input
                        type="radio"
                        name="table1"
                        onChange={(e) => handleCheckForXaxis(e, option)}
                        className="radio-button custom-radio"
                      />
                    ) : (
                      // <input type="radio" name="styles" id="outline" class="custom-radio">
                      // <label for="outline">outline</label>
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckForXaxis(e, option)}
                        className="radio-button"
                      />
                    )}

                    <label for="outline">{option}</label>
                  </div>
                ))}
              </div>

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
            <div class="visible-charts">
              {isButtonClicked && renderComponent()}
              <div className="chart-download">
        {isButtonClicked ? (
          // <button onClick={handleDownload}>Download chart</button>
          <button class="button-50" role="button" onClick={handleDownload}>Download chart</button>

        ) : null}
        </div>
            </div>
          </div>
        </>
        
      </div>
    </>
  );
}
