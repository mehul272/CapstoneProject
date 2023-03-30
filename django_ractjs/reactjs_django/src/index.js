import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "../src/resources/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import UploadFile from "./components/UploadFile";
import { Transformation } from "./components/Transformation";

function Router() {
  const [columnNames, setColumnNames] = useState([]);
  const [numRows, setNumRows] = useState("");
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <UploadFile
              updateColumnNames={(value) => setColumnNames(value)}
              updateNumRows={(value) => setNumRows(value)}
              updateTitle={(value) => setTitle(value)}
              updateFileName={(value) => setFileName(value)}
              updateData={(value) => setData(value)}
            />
          }
        />
        <Route exact path="/app" element={<App />} />
        <Route
          exact
          path="/transform"
          element={
            <Transformation
              columnNames={columnNames}
              numRows={numRows}
              fileName={fileName}
              title={title}
              data={data}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
