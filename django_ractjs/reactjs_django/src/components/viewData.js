import axios from "axios";
import { useState, useEffect } from "react";

export function ViewData({ data, numRows }) {
  const columnNames = new Set(data.flatMap((obj) => Object.keys(obj)));

  const tableData = numRows === "All" ? data.slice(0, 40) : data;

  return (
    <div>
      <table className="table table-bordered mt-4">
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
    </div>
  );
}
