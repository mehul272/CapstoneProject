import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { ViewData } from "./viewData";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export const stringToOptions = (item) => ({ value: item, label: item });

const PER_PAGE_PAGINATION_OPTIONS = ["10", "20", "40", "All"].map(
  stringToOptions
);

export function Extraction({
  showModal,
  updateModal,
  columnNames,
  title,
  updateColumnNames,
  updateFileName,
  updateNumRows,
  updateData,
  url,
}) {
  let navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);

  const [fileDownloading, setFileDownloading] = useState(false);

  const [columnNamesArray, setColumnNamesArray] = useState([]);

  const [data, setData] = useState([]);

  const [numRows, setNumRows] = useState("20");

  const [fileName, setFileName] = useState("ExtractedFile");

  const handleClose = () => {
    updateModal(false);
    setData([]);
  };

  const handleDoTransformation = () => {
    if (
      !window.confirm(
        `Are you sure you want to start the Transformation Process?`
      )
    ) {
      return;
    }

    updateModal(false);
    navigate("/transform");
  };

  let api = "http://127.0.0.1:8000/api";

  const handleFilterColumnNames = (event, option) => {
    const isChecked = event.target.checked;
    const isIncluded = columnNamesArray.includes(option);

    if (isChecked && !isIncluded) {
      columnNamesArray.push(option);
    } else if (!isChecked) {
      columnNamesArray.splice(columnNamesArray.indexOf(option), 1);
    }

    setColumnNamesArray(columnNamesArray);
    updateColumnNames(columnNamesArray);
  };

  const handleExtraction = async () => {
    await axios
      .get(
        api + `/filter-files-data/${title}`,
        {
          params: {
            stringArray: JSON.stringify(columnNamesArray),
            numRows: numRows,
          },
        },
        url
      )
      .then((res) => {
        setData(res.data.result);
        updateData(res.data.result);
      });
  };

  const handleRowSelect = async (event) => {
    console.log("Hello World: ", event.value);
    await updateNumRows(event.value);

    setNumRows(event.value);
  };

  const handleFileNameChange = (event) => {
    updateFileName(event.target.value);
    setFileName(event.target.value);
  };

  return (
    <>
      <Modal
        show={showModal}
        centered
        size="xl"
        data-toggle="modal"
        data-keyboard="false"
        data-backdrop="static"
        onHide={handleClose}
      >
        <Modal.Header>EXtraction</Modal.Header>
        <Modal.Body>
          <>
            {columnNames.map((option, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  onChange={(e) => handleFilterColumnNames(e, option)}
                />
                {option}
              </div>
            ))}
            <div>
              <Select
                name="invoicePerPage"
                defaultValue={PER_PAGE_PAGINATION_OPTIONS[1]}
                onChange={(e) => handleRowSelect(e)}
                options={PER_PAGE_PAGINATION_OPTIONS}
                className="lg-my-0 w-1 h-25"
              />
              <form>
                <div className="form-group">
                  <label
                    htmlFor="exampleFormControlFile1"
                    className="float-left"
                  >
                    File Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => handleFileNameChange(e)}
                    className="form-control"
                  />
                </div>
              </form>
              <Button
                variant="primary"
                onClick={handleExtraction}
                disabled={isSaving}
              >
                Extract Data from Files
              </Button>
            </div>

            <div>
              {numRows === "All" ? (
                <h1>First 40 Data to Display</h1>
              ) : (
                <h1>Display {numRows} rows of the File</h1>
              )}

              <ViewData
                data={data}
                numRows={numRows}
                columnNamesArray={columnNamesArray}
                fileName={fileName}
              />
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bordered" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>

          <Button
            variant="bordered"
            onClick={handleDoTransformation}
            disabled={isSaving}
          >
            Start the Transformation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
