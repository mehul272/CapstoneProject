import { ViewData } from "./viewData";
import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { stringToOptions } from "./Extraction";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderPart from "./Header";
import "../resources/css/Transformation.css";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

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

  const classes = useStyles();

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
    console.log("Hi", option);

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

  const handleSelectChange = (event) => {
    const { value } = event.target;

    console.log("Hello M: ", value);

    value.forEach((item) => {
      if (item[0] === "8") {
        setSort(true);
      } else {
        setSort(false);
      }
    });

    setTransformationOptions(value);
    console.log(transformationOptions);
  };

  return (
    <>
      <HeaderPart
        phaseNumber={2}
        phaseName={"Transform"}
        imgSource="https://www.unite.ai/wp-content/uploads/2023/01/etl-1-990x600.png"
      />

      <div className="transform-body">
        <div className="transform-page select-all-checkbox">
          <input type="checkbox" onChange={handleSelectAll} />
          <label>Select All</label>
          {removeDuplicates(columnNames).map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
                className="type2 indi-checkbox"
                onChange={(e) => handleFilterColumnNames(e, option)}
              />
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="options-tranform-checkbox">
        <h5>Transformation Options: </h5>
        {/* {TRANSFORMATION_OPTION.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              onChange={(e) => handleFilteredTransformationOptions(e, option)}
            />
            {option}
          </div>
        ))} */}

        <div>
          <FormControl className={classes.formControl}>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={transformationOptions}
              onChange={handleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {TRANSFORMATION_OPTION.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox
                    checked={transformationOptions.indexOf(option) > -1}
                  />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="sort-dropdown">
        {sort ? (
          <div>
            <h7>Choose ColumnName</h7>
            <ReactSelect
              name="optionPerPage"
              onChange={(e) => setSortColumn(e.value)}
              options={COLUMN_NAMES}
              className="lg-my-0 w-1 h-25"
            />
          </div>
        ) : null}
      </div>

      <div className="transform-button">
        <Button
          variant="primary"
          onClick={handleTranformation}
          disabled={column.length === 0}
        >
          Transformation
        </Button>
      </div>

      <div className="view-tranform-data">
        {startLoading && (
          <ViewData
            data={transformedData}
            numRows={numRows}
            columnNamesArray={columnNames}
            fileName={fileName}
          />
        )}
      </div>

      <div className="load-button">
        <Button
          variant="bordered"
          onClick={handleDoLoading}
          disabled={!startLoading}
          className="button-86"
          role="button"
        >
          Start the Loading
        </Button>
      </div>
    </>
  );
}
