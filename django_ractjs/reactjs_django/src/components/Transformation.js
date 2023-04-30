import { ViewData } from "./viewData";
import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TRANSFORMATION_OPTION = [
  "1. Remove duplicate rows",
  "2. Replace missing values with the mean of each column",
  "3. Convert string columns to uppercase",
  "4. Remove columns with all missing values",
  "5. Convert a categorical column to numeric",
  "6. Replace null values with N/A",
  "7. Convert string columns to lowercase",
];

export function Transformation({
  columnNames,
  numRows,
  fileName,
  title,
  data,
}) {
  let api = "http://127.0.0.1:8000/api";

  console.log(numRows);

  let navigate = useNavigate();

  const [transformation, setTransformation] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [column, setColumn] = useState([]);

  const [transformedData, setTransformedData] = useState([]);

  const [transformationOptions, setTransformationOptions] = useState([]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleTranformation = async () => {
    await axios
      .get(api + `/start-transformation/${title}`, {
        params: {
          stringArray: JSON.stringify(column),
          numRows: numRows,
          transformation: transformation,
          transformationOptions: JSON.stringify(transformationOptions),
        },
      })
      .then((res) => {
        setTransformedData(res.data.result);
      });
  };

  const handleFilterColumnNames = (event, option) => {
    const isChecked = event.target.checked;
    const isIncluded = columnNames.includes(option);

    if (isChecked && !isIncluded) {
      columnNames.push(option);
    } else if (!isChecked) {
      columnNames.splice(columnNames.indexOf(option), 1);
    }
    setColumn(columnNames);
  };

  const handleFilteredTransformationOptions = (event, option) => {
    const isChecked = event.target.checked;
    const isIncluded = transformationOptions.includes(option);

    if (isChecked && !isIncluded) {
      transformationOptions.push(option);
    } else if (!isChecked) {
      transformationOptions.splice(transformationOptions.indexOf(option), 1);
    }
    setTransformationOptions(transformationOptions);
  };

  const handleDoLoading = async () => {
    if (!window.confirm(`Are you sure you want to start the Loading?`)) {
      return;
    }

    await axios
      .get(api + `/start-loading`, {
        params: {
          stringArray: JSON.stringify(transformedData),
        },
      })
      .then((res) => {
        navigate("/load");
      });

    setShowModal(false);
  };

  return (
    <>
      <h1>Hi Do Transformation</h1>

      <h1>Till Now the Data is saved in the File {`${fileName}.csv`}</h1>

      <Button onClick={() => setShowModal(true)}>Start Transformation</Button>

      <Modal
        show={showModal}
        centered
        size="xl"
        data-toggle="modal"
        data-keyboard="false"
        data-backdrop="static"
        onHide={handleClose}
      >
        <Modal.Header>Transformation</Modal.Header>
        <Modal.Body>
          {columnNames.map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
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
          <Button
            variant="primary"
            onClick={handleTranformation}
            disabled={isSaving}
          >
            Transformation
          </Button>
          <ViewData
            data={transformedData}
            numRows={numRows}
            columnNamesArray={columnNames}
            fileName={fileName}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bordered" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="bordered"
            onClick={handleDoLoading}
            disabled={isSaving}
          >
            Start the Loading
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
