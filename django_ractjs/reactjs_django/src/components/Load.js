import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isStringValue } from "./chartSelection";
import ErrorModal from "./ErrorModal";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Load = ({ loadComplete, updateTableData }) => {
  const classes = useStyles();

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
      navigate('/load')
    } else {
      navigate('/end');
    }
  };

  return (
    <>
      <h1>Loading...</h1>
      {loadComplete ? (
        <>
          <h1>Done</h1>
          <Button onClick={handleLoadTables}>Load Tables</Button>
          <div>
            {tables.map((table) => (
              <div key={table}>
                <input
                  type="radio"
                  name="table"
                  value={table}
                  checked={selectedTable === table}
                  onChange={handleTableChange}
                />
                {table}
              </div>
            ))}
            <p>You selected: {selectedTable}</p>
          </div>

          <Button onClick={handleVisualizeTables}>Visualize Tables</Button>

          <ErrorModal
            open={showModal}
            errorMessage="Please select at least one column for string values and one column for numeric values."
            onClose={handleCloseModal}
          />
        </>
      ) : (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <ToastContainer />
    </>
  );
};

export default Load;
