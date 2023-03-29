import axios from "axios";
import { useState, useEffect } from "react";

export function ViewData({ data }) {
  const columnNames = new Set(data.flatMap((obj) => Object.keys(obj)));

  console.log("My Data: ", data);

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
          {data.map((row) => (
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
