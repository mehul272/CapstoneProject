import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { ViewData } from "./viewData";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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


  const [columnNamesArray, setColumnNamesArray] = useState([]);

  const [data, setData] = useState([]);

  const [numRows, setNumRows] = useState("20");

  const [fileName, setFileName] = useState("ExtractedFile");

  const [startTransform, setStartTransform] = useState(false);

  const handleClose = () => {
    updateModal(false);
    setData([]);
    setStartTransform(false)
    setColumnNamesArray([])
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
    const updatedFilters = [...columnNamesArray];
    if (isChecked) {
      updatedFilters.push(option);
    } else {
      const index = updatedFilters.indexOf(option);
      if (index !== -1) {
        updatedFilters.splice(index, 1);
      }
    }

    setColumnNamesArray(updatedFilters);
    updateColumnNames(updatedFilters);
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
        setStartTransform(true);
        toast.success("Successfully Extracted")

      });
  };

  const handleSelectAll = (e) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
    if (e.target.checked) {
      setColumnNamesArray(columnNames);
      updateColumnNames(columnNames);
    } else {
      setColumnNamesArray([]);
      updateColumnNames([]);
    }
  };

  const handleRowSelect = async (event) => {
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
        <Modal.Header>EXTRACTION</Modal.Header>
        <Modal.Body>
          <>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              class="select-all"
              id="myCheckbox"
            />
            <label>Select All</label>
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
                disabled={columnNamesArray.length === 0}
              >
                Extract Data from Files
              </Button>
            </div>

            {startTransform && (
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
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="bordered" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="bordered"
            onClick={handleDoTransformation}
            disabled={!startTransform}
          >
            Start the Transformation
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
