import axios from "axios";
import { useState, useEffect } from "react";

export function ViewData({ data }) {
  const columnNames1 = new Set(data.flatMap((obj) => Object.keys(obj)));

  console.log(columnNames1);
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columnNames1.forEach((column) => (
              <th>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.forEach((row) => (
            <tr>
              {columnNames1.forEach((column) => (
                <td>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
