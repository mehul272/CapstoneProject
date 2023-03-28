import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { ViewData } from "./viewData";
import Select from "react-select";

const stringToOption = (item) => ({ value: item, label: item });

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
      })
      .then(() => {
        updateModal(false);
      });
  };

  const handleRowSelect = (event) => {
    setNumRows(event.value);
  };

  return (
    <>
      <Modal
        show={showModal}
        centered
        size="lg"
        data-toggle="modal"
        data-keyboard="false"
        data-backdrop="static"
        onHide={handleClose}
      >
        <Modal.Header>Update</Modal.Header>
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
      <ViewData data={data} />
    </>
  );
}
