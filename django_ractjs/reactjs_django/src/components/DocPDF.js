import { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "../resources/css/DocPDF.css";
import docPDF from '../B56_Capstone Project_ELT.pdf';
import AppNavbar from './Navbar';

const DocPDF = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <div>
        <AppNavbar />
    
    <div className="page">
         
      <nav>
        <button onClick={goToPrevPage} className="previous">
          Prev
        </button>
        <button onClick={goToNextPage} className="next">
          Next
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </nav>

      <Document file={docPDF} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
    </div>
  );
};

export default DocPDF;