import { useMemo, useState, memo } from "react";
import { useTable } from "react-table";
import "../styles/Table.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CustomClipboard from "../components/CustomClipboard";

export default memo(function CustomTable({ secrets = [], onDelete }) {
  const [revealedRows, setRevealedRows] = useState({});

  const toggleReveal = (index) => {
    setRevealedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const data = useMemo(
    () => (Array.isArray(secrets) ? secrets : []),
    [secrets]
  );

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row, value }) => {
          const isVisible = revealedRows[row.index];

          return (
            <div className="cell-with-action">
              <span className={isVisible ? "" : "masked-text"}>
                {isVisible ? value : "••••••"}
              </span>

              {isVisible && <CustomClipboard value={value} />}
            </div>
          );
        },
      },
      {
        Header: "Password",
        accessor: "password",
        Cell: ({ row, value }) => {
          const isVisible = revealedRows[row.index];

          return (
            <div className="cell-with-action">
              <span className={isVisible ? "" : "masked-text"}>
                {isVisible ? value : "••••••"}
              </span>

              {isVisible && <CustomClipboard value={value} />}
            </div>
          );
        },
      },
      {
        Header: "Notes",
        accessor: "notes",
        Cell: ({ row, value }) => (
          <span className={revealedRows[row.index] ? "" : "masked-text"}>
            {revealedRows[row.index] ? value : value ? "••••••" : ""}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="secrets-actions">
            <span
              className="eye-icon"
              onClick={() => toggleReveal(row.index)}
              title={revealedRows[row.index] ? "Hide" : "Show"}
            >
              {revealedRows[row.index] ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </span>
            <button
              className="delete-button"
              onClick={() => onDelete(row.index)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onDelete, revealedRows]
  );

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table {...getTableProps()} className="secrets-table">
      <thead>
        {headerGroups.map((hg) => (
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map((col) => (
              <th {...col.getHeaderProps()}>{col.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
