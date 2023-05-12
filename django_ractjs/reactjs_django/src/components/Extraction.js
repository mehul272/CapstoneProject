import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { ViewData } from "./viewData";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../resources/css/Extraction.css";

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
          <div className="select-all-checkbox">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              className="select-all checkbox-pull"
              id="check3"
            />
            <label for="check3"><span></span>Select All</label>
            </div>

            <div className="checkbox-wrapper custom-font">
            {columnNames.map((option, index) => (
           
              <div key={index} className="all-columns-checkbox checkbox-wrapper-47">
                <input
                  type="checkbox"
                  onChange={(e) => handleFilterColumnNames(e, option)}
                  className="plus-minus"
                  name="cb" 
                  id="cb-47"
                /><label for="cb-47" className="col-name">{option}</label>
              </div>
              
            ))}
            </div>

           

            <div className="custom-filed">
            <label
                    htmlFor="exampleFormControlFile1"
                    className="float-left"
                    style={{ marginRight: '1rem' }}
                  >
                    Rows Count
                  </label>
              <Select
                name="optionperpage"
                defaultValue={PER_PAGE_PAGINATION_OPTIONS[1]}
                onChange={(e) => handleRowSelect(e)}
                options={PER_PAGE_PAGINATION_OPTIONS}
                className="lg-my-0 w-1 h-25 rows-count"
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
                    className="form-control file-name"
                  />
                </div>
              </form>
              </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
                {/* {numRows === "All" ? (
                  <h4>First 40 Data to Display</h4>
                ) : (
                  <h4>Display {numRows} rows of the File</h4>
                )} */}

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
            className="css-button-arrow--black"
          >
            Start the Transformation
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
