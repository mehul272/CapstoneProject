import { Button, Form, Modal, Row, Col, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export function Extraction({
  showModal,
  updateModal,
  columnNames,
  title,
  url,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const [columnNamesArray, setColumnNamesArray] = useState([]);

  const handleClose = () => updateModal(false);

  let api = "http://127.0.0.1:8000/api";

  const handleFilterColumnNames = (event, option) => {
    const isChecked = event.target.checked;
    const isIncluded = columnNamesArray.includes(option);

    if (isChecked && !isIncluded) {
      columnNamesArray.push(option);
    } else if(!isChecked) {
      columnNamesArray.splice(columnNamesArray.indexOf(option), 1);
    }

    setColumnNamesArray(columnNamesArray);
  };

  const handleExtraction = async () => {
    await axios
      .get(
        api + `/filter-files-data/${title}`,
        { params: { stringArray: JSON.stringify(columnNamesArray) } },
        url
      )
      .then((res) => {
        console.log("Done: ", res.data.result);
      });
  };

  return (
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
        {columnNames.map((option, index) => (
          <div key={index}>
            <input
              type="checkbox"
              onChange={(e) => handleFilterColumnNames(e, option)}
            />
            {option}
          </div>
        ))}
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
  );
}
