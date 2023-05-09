import { ViewData } from "./viewData";
import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { stringToOptions } from "./Extraction";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderPart from "./Header";
import "../resources/css/Transformation.css";
import * as React from "react";

const TRANSFORMATION_OPTION = [
  "1. Remove duplicate rows",
  "2. Replace missing values with the mean of each column",
  "3. Convert string columns to uppercase",
  "4. Remove columns with all missing values",
  "5. Convert a categorical column to numeric",
  "6. Replace null values with N/A",
  "7. Convert string columns to lowercase",
  "8. Sort Dataframe",
];

function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}

export function Transformation({
  columnNames,
  numRows,
  fileName,
  title,
  data,
  updateLoadComplete,
}) {
  let api = "http://127.0.0.1:8000/api";

  const COLUMN_NAMES = [...removeDuplicates(columnNames), "All"].map(
    stringToOptions
  );

  let navigate = useNavigate();

  const [column, setColumn] = useState([]);

  const [transformedData, setTransformedData] = useState([]);

  const [transformationOptions, setTransformationOptions] = useState([]);

  const [sort, setSort] = useState(false);

  const [sortColumn, setSortColumn] = useState("");
  const [startLoading, setStartLoading] = useState(false);

  const handleTranformation = async () => {
    const result = await axios
      .get(api + `/start-transformation/${title}`, {
        params: {
          stringArray: JSON.stringify(column),
          numRows: numRows,
          transformationOptions: JSON.stringify(transformationOptions),
          sortColumn: sortColumn,
        },
      })
      .catch((err) => {
        toast.error(err);
      });

    if (result) {
      try {
        setTransformedData(result.data.result);
        setStartLoading(true);
        toast.success("Successfully Transformed");
      } catch (err) {
        toast.error(err);
      }
    }
  };

  const handleFilterColumnNames = (event, option) => {
    const isChecked = event.target.checked;
    const updatedFilters = [...column];
    if (isChecked) {
      updatedFilters.push(option);
    } else {
      const index = updatedFilters.indexOf(option);
      if (index !== -1) {
        updatedFilters.splice(index, 1);
      }
    }
    setColumn(updatedFilters);
  };

  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"].type2'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
    if (e.target.checked) {
      setColumn(columnNames);
    } else {
      setColumn([]);
    }
  };

  const handleFilteredTransformationOptions = (event, option) => {
    const isChecked = event.target.checked;
    const isIncluded = transformationOptions.includes(option);

    if (isChecked && !isIncluded) {
      if (option[0] === "8") {
        setSort(true);
      }
      transformationOptions.push(option);
    } else if (!isChecked) {
      if (option[0] === "8") {
        setSort(false);
      }
      transformationOptions.splice(transformationOptions.indexOf(option), 1);
    }
    setTransformationOptions(transformationOptions);
  };

  const handleDoLoading = async () => {
    let input = window.prompt("Enter the name of the table:");

    if (input !== null && input !== "") {
      if (window.confirm(`Are you sure you want to start the Loading?`)) {
        await axios
          .get(api + `/start-loading`, {
            params: {
              stringArray: JSON.stringify(transformedData),
              tableName: input,
            },
          })
          .then((res) => {
            if (res.data.status === false) {
              toast.error(res.data.data);
            } else {
              toast.success(res.data.data);
              updateLoadComplete(res.data.status);
              navigate("/load");
            }
          });
      } else {
        return;
      }
    }
  };

  return (
    <>
      <HeaderPart
        phaseNumber={2}
        phaseName={"Transform"}
        imgSource="https://www.unite.ai/wp-content/uploads/2023/01/etl-1-990x600.png"
      />

      <div class="transform-page">
        <input type="checkbox" onChange={handleSelectAll} />
        <label>Select All</label>
        {columnNames.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              class="type2"
              onChange={(e) => handleFilterColumnNames(e, option)}
            />
            {option}
          </div>
        ))}
        <h2>Transformation Options</h2>
        {TRANSFORMATION_OPTION.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              onChange={(e) => handleFilteredTransformationOptions(e, option)}
            />
            {option}
          </div>
        ))}

        {sort ? (
          <div>
            <h3>Choose ColumnName</h3>
            <Select
              name="invoicePerPage"
              onChange={(e) => setSortColumn(e.value)}
              options={COLUMN_NAMES}
              className="lg-my-0 w-1 h-25"
            />
          </div>
        ) : null}
        <Button
          variant="primary"
          onClick={handleTranformation}
          disabled={column.length === 0}
        >
          Transformation
        </Button>
        {startLoading && (
          <ViewData
            data={transformedData}
            numRows={numRows}
            columnNamesArray={columnNames}
            fileName={fileName}
          />
        )}

        <Button
          variant="bordered"
          onClick={handleDoLoading}
          disabled={!startLoading}
        >
          Start the Loading
        </Button>
      </div>
    </>
  );
}
