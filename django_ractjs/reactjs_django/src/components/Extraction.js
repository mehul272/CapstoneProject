import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { ViewData } from "./viewData";
import Select from "react-select";
import { CSVLink } from "react-csv";

const xlsx = require("xlsx");

const stringToOption = (item) => ({ value: item, label: item });

const headersToKeyValue = (item) => ({ label: item, key: item });

const PER_PAGE_PAGINATION_OPTIONS = ["10", "20", "40", "100"].map(
  stringToOption
);

export function Extraction({
  showModal,
  updateModal,
  columnNames,
  title,
  url,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const [columnNamesArray, setColumnNamesArray] = useState([]);

  const [data, setData] = useState([]);

  const [numRows, setNumRows] = useState(0);

  const handleClose = () => updateModal(false);

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
      });
  };

  const handleRowSelect = (event) => {
    setNumRows(event.value);
  };

  const handleExportToExcel = () => {
    let workBook = xlsx.utils.book_new();
    let workSheet = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(workBook, workSheet);
    xlsx.writeFile(workBook, "ConvertedJsonToExcel.xlsx");
  };

  const handleExportToJSON = () => {
    const fileName = "data.json";

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const downloadLink = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(downloadLink);
  };

  const headers = columnNamesArray.map(headersToKeyValue);

  const csvLink = {
    filename: "ExtractedFile.csv",
    headers: headers,
    data: data,
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
            <Select
              name="invoicePerPage"
              onChange={(e) => handleRowSelect(e)}
              options={PER_PAGE_PAGINATION_OPTIONS}
              className="lg-my-0 w-1 h-25"
            />
            <div>
              <h1>My data</h1>
              <ViewData data={data} />
              <CSVLink {...csvLink}>Export to CSV</CSVLink>

              <Button
                variant="primary"
                onClick={handleExportToExcel}
                disabled={isSaving}
              >
                Export to Excel
              </Button>
              <Button
                variant="primary"
                onClick={handleExportToJSON}
                disabled={isSaving}
              >
                Export to JSON
              </Button>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bordered" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExtraction}
            disabled={isSaving}
          >
            Extract
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
