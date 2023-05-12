import React, { useState, useEffect } from "react";
import axios from "axios";
import { Extraction } from "./Extraction";
import "../resources/css/UploadFile.css";
import HeaderPart from "./Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadFile({
  updateColumnNames,
  updateNumRows,
  updateTitle,
  updateFileName,
  updateData,
}) {
  const [filename, setFilename] = useState("");
  const [files, setFiles] = useState([{}]);
  const [status, setstatus] = useState("");
  const [fileData, setFileData] = useState({ title: 0, url: "" });

  const [fileStatus, setFileStatus] = useState(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [columnNames, setColumnNames] = useState([]);

  let api = "http://127.0.0.1:8000/api";

  const saveFile = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("pdf", filename);

    await axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/files/",
      data: formData,
    })
      .catch((err) => {
        toast.error(err);
      })
      .then((response) => {
        toast.success("File Uploaded Successfully");
      })
      .then((res) => {
        window.location.reload();
      });
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
        toast.success("Successfully Downloaded");
      })
      .catch((error) => {
        toast.error(error);
      });
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
        toast.error(error);
      });
    await updateTitle(title);
  };

  useEffect(() => {
    getFiles();
  }, []);

  const [disabled, setDisabled] = useState(false);

  const handleMouseEnter = () => {
    setDisabled(true);
  };

  const handleMouseLeave = () => {
    setDisabled(false);
  };

  return (
    <div>
      <HeaderPart phaseNumber={1} phaseName={"Extract"} imgSource={"https://static.thenounproject.com/png/3147308-200.png"}/>

      <div className="container-fluid ">
        <div className="row bg-pan-right">
          <div className="col-md-4">
            <h3 className="alert">File Upload Section</h3>

            <form>
              <div className="form-group">
                <label htmlFor="exampleFormControlFile1" className="float-left">
                  Browse a File To Upload
                </label>
                <input
                  type="file"
                  // accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (
                      file &&
                      (file.type === "text/csv" ||
                        file.type ===
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    ) {
                      setFilename(file);
                      setFileStatus(true);
                    } else {
                      setFileStatus(false);
                      toast.error("Please upload a CSV or Excel file");
                    }
                  }}
                  className="form-control"
                />
              </div>

              <button
                type="button"
                disabled={!fileStatus}
                onClick={saveFile}
                className="btn btn-primary float-left mt-2 submitBtn shake-top"
              >
                Submit
              </button>
              <br />
              <br />
              <br />

              {status ? <h2>{status}</h2> : null}
            </form>
            <h1> OR </h1>
            <br />
            <br />

            <h3>This part of the app is coming soon!</h3>
            <br />

            <div
              className="form-group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <label className="float-left">Provide the Web Link</label>
              <input type="text" disabled={disabled} className="form-control" />
            </div>

            <button
              type="button"
              disabled={disabled}
              className="btn btn-primary float-left mt-2 "
            >
              Submit
            </button>
          </div>

          <div className="col-md-7 buttons-animations">
            {/* <h2 className="alert">List of Uploaded Files & Download </h2> */}

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
                        <button
                          onClick={() => downloadWithAxios(file.pdf, file.id)}
                          className="btn btn-success btn2"
                        >
                          <p data-text="start!" data-title="Download"></p>
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => extractionStart(file.pdf, file.id)}
                          className="btn btn-danger btn2"
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
      <ToastContainer />
    </div>
  );
}

export default UploadFile;
