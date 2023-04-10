import { ViewData } from "./viewData";
import axios from "axios";
import { useState } from "react";
import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";
import { stringToOptions } from "./Extraction";
import Select from "react-select";

const TRANSFORMATION_OPTIONS = ["Multiply this row by 10"].map(stringToOptions);

export function Transformation({
  columnNames,
  numRows,
  fileName,
  title,
  data,
}) {
  let api = "http://127.0.0.1:8000/api";

  console.log(numRows);

  const [transformation, setTransformation] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [column, setColumn] = useState([]);

  const [transformedData, setTransformedData] = useState([]);

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
          <Select
            name="invoicePerPage"
            onChange={(e) => setTransformation(e.value)}
            options={TRANSFORMATION_OPTIONS}
            className="lg-my-0 w-1 h-25"
          />
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
