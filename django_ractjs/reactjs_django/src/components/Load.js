import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [selectedTable, setSelectedTable] = useState("");

  console.log("hi", loadComplete);

  const handleLoadTables = async () => {
    await axios.get(api + `/tables`).then((res) => {
      setTables(res.data.data);
    });
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const handleVisualizeTables = async () => {
    await axios
      .get(api + `/visualize-tables/${selectedTable}/`)
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        updateTableData(res.data.data);
        navigate("/visualize");
      });
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
        </>
      ) : (
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Load;
