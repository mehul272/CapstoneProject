import { Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../resources/css/viewData.css";

const xlsx = require("xlsx");

const headersToKeyValue = (item) => ({ label: item, key: item });

export function ViewData({ data, numRows, columnNamesArray, fileName }) {

  const columnNames = new Set(data.flatMap((obj) => Object.keys(obj)));

  const tableData = numRows === "All" ? data.slice(0, 41) : data;

  const handleExportToExcel = async () => {
    let workBook = xlsx.utils.book_new();
    let workSheet = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(workBook, workSheet);
    xlsx.writeFile(workBook, `${fileName}.xlsx`);

    toast.success("Successfully Downloaded")
  };

  const handleExportToJSON = async () => {
    const blob = await new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const downloadLink = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = await `${fileName}.json`;
    document.body.appendChild(link);
    link.click();

    // cleaning the document and url after download
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadLink);

    toast.success("Successfully Downloaded")

  };

  const headers = columnNamesArray.map(headersToKeyValue);

  const csvLink = {
    filename: `${fileName}.csv`,
    headers: headers,
    data: data,
  };

  return (
    <div className="parent-container">
      <table className="table table-bordered mt-4" >
        <thead>
          <tr>
            {Array.from(columnNames).map((column) => (
              <th>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr>
              {Array.from(columnNames).map((column) => (
                <td>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <CSVLink {...csvLink}>Export to CSV</CSVLink>

        <Button
          variant="primary"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
        <Button
          variant="primary"
          onClick={handleExportToJSON}
        >
          Export to JSON
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}
