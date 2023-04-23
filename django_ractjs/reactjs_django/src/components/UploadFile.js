import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Extraction } from "./Extraction";
import AppNavbar from './Navbar';
//UploadFile ---> Parent Component(Transformation(props Bool,Data))

//Extraction --> Child (props --> Bool, Data)
//Transformation --> Child

//create a state

function UploadFile({
  updateColumnNames,
  updateNumRows,
  updateTitle,
  updateFileName,
  updateData
}) {
  const [filename, setFilename] = useState("");
  const [files, setFiles] = useState([{}]);
  const [status, setstatus] = useState("");
  const [fileData, setFileData] = useState({ title: 0, url: "" });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [columnNames, setColumnNames] = useState([]);

  let api = "http://127.0.0.1:8000/api";

  const saveFile = async () => {
    let formData = new FormData();
    formData.append("pdf", filename);

    let axiosConfig = {
      headers: {
        "Content-Type": "multpart/form-data",
      },
    };

    await axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/files/",
      data: formData,
    }).then((response) => {});
  };

  const getFiles = () => {
    axios
      .get(api + "/files/")
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const forceDownload = (response, title) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", title + ".csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadWithAxios = (url, title) => {
    axios({
      method: "get",
      url,
      responseType: "arraybuffer",
    })
      .then((response) => {
        forceDownload(response, title);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateModal = (value) => {
    setShowUpdateModal(value);
  };

  const extractionStart = async (url, title) => {
    handleUpdateModal(true);

    await axios
      .get(api + `/upload-files-data/${title}/`, url)
      .then((response) => {
        setColumnNames(response.data.success);
        setFileData({ title: title, url: url });
      })
      .catch((error) => {
        console.log(error);
      });
    await updateTitle(title);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="container-fluid">
       
      <div className="row">
        <div className="col-md-4">
          <h2 className="alert">File Upload Section</h2>

          <form>
            <div className="form-group">
              <label htmlFor="exampleFormControlFile1" className="float-left">
                Browse A File To Upload and Enjoy
              </label>
              <input
                type="file"
                onChange={(e) => setFilename(e.target.files[0])}
                className="form-control"
              />
            </div>

            <button
              type="button"
              onClick={saveFile}
              className="btn btn-primary float-left mt-2"
            >
              Submit
            </button>
            <br />
            <br />
            <br />

            {status ? <h2>{status}</h2> : null}
          </form>
        </div>

        <div className="col-md-7">
          <h2 className="alert">List of Uploaded Files & Download </h2>

          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">File Title</th>
                <th scope="col">Download</th>
                <th scope="col">Do Extraction</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                return (
                  <tr>
                    <td>{file.pdf}</td>
                    <td>
                      <a href="" target="_blank"></a>

                      <button
                        onClick={() => downloadWithAxios(file.pdf, file.id)}
                        className="btn btn-success"
                      >
                        DownLoad
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => extractionStart(file.pdf, file.id)}
                        className="btn btn-danger"
                      >
                        Do Extraction
                      </button>
                      <Extraction
                        showModal={showUpdateModal}
                        updateModal={(value) => handleUpdateModal(value)}
                        columnNames={columnNames}
                        title={fileData.title}
                        url={fileData.url}
                        updateColumnNames={updateColumnNames}
                        updateFileName={updateFileName}
                        updateNumRows={updateNumRows}
                        updateData={updateData}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
