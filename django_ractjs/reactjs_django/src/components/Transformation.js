import { ViewData } from "./viewData";

export function Transformation({
  columnNames,
  numRows,
  fileName,
  title,
  data,
}) {
  return (
    <>
      <h1>Hi Do Transformation</h1>

      <h1>Till Now the Data is saved in the File {`${fileName}.csv`}</h1>
      <ViewData
        data={data}
        numRows={numRows}
        columnNamesArray={columnNames}
        fileName={fileName}
      />
    </>
  );
}
