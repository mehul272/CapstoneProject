import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isStringValue } from "./chartSelection";
import ErrorModal from "./ErrorModal";
import HeaderPart from "./Header";
import "../resources/css/Load.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ListItemText } from "@material-ui/core";


const Load = ({ loadComplete, updateTableData }) => {

  let navigate = useNavigate();

  let api = "http://127.0.0.1:8000/api";

  const [tables, setTables] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [selectedTable, setSelectedTable] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleLoadTables = async () => {
    await axios
      .get(api + `/tables`)
      .then((res) => {
        toast.success("The tables are Displayed Successfully");
        setTables(res.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleVisualizeTables = async () => {
    try {
      const res = await axios.get(api + `/visualize-tables/${selectedTable}/`);
      updateTableData(res.data.data);
      setTableData(res.data.data);

      const columns = Object.keys(res.data.data[0]);
      const filteredColumns = columns.filter((column) => column !== "id");

      const stringValueCols = filteredColumns.filter((col) =>
        isStringValue(res.data.data, col)
      );
      const numericValueCols = filteredColumns.filter(
        (col) => !isStringValue(res.data.data, col)
      );

      if (stringValueCols.length === 0 || numericValueCols.length === 0) {
        setShowModal(true);
      } else {
        await navigate("/visualize");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleCloseModal = (confirmed) => {
    setShowModal(false);
    if (confirmed) {
      navigate("/load");
    } else {
      navigate("/end");
    }
  };

  return (
    <>
      <HeaderPart
        phaseNumber={3}
        phaseName={"Load"}
        imgSource="https://st4.depositphotos.com/14846838/21750/v/600/depositphotos_217501562-stock-illustration-big-cogwheel-having-circuit-design.jpg"
      />
      <div className="load-body">
        <>
          <div class="image-container">
            <img
              src="https://clipartix.com/wp-content/uploads/2019/03/success-clipart-2019-17.png"
              alt="Image description"
            />
          </div>

          <div className="list-all-loaded-data">
            <Button
              onClick={handleLoadTables}
              className="button-30"
              role="button"
            >
              List the Loaded Tables
            </Button>
          </div>

          <div className="listing-table">
            {tables.length > 0 && (
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small-label">Table</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectedTable}
                    label="tables"
                    onChange={handleTableChange}
                  >
                    {tables.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>

          <div className="visualize-button">
            {selectedTable !== "" && (
              <div className="visualisation">
                <Button
                  onClick={handleVisualizeTables}
                  className="button-85 button-large"
                  role="button"
                >
                  Visualize
                </Button>
              </div>
            )}
          </div>

          <ErrorModal
            open={showModal}
            errorMessage="Please select at least one column for string values and one column for numeric values."
            onClose={handleCloseModal}
          />
        </>
      </div>
      <ToastContainer />
    </>
  );
};

export default Load;
