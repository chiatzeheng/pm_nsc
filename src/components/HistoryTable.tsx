import { useGlobalContext } from "@/context";
// import { decryptStringWithKey } from "@/utils/encrypt";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
interface Column {
  id: "question" | "topic" | "answer" | "userAnswer";
  label: string;
  width?: number | string;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "question", label: "Question", width: 50 },
  { id: "topic", label: "Topic", width: 80 },
  { id: "answer", label: "Correct Answer", width: 80 },
  { id: "userAnswer", label: "Your Answer", width: 80 },
];

const HistoryTable = () => {
  const { history } = useGlobalContext();
  // console.log(history);
  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((row, idx) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === "question") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <pre>{value}</pre>
                      </TableCell>
                    );
                  }
                  if (column.id === "answer") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value.toString()}
                      </TableCell>
                    );
                  }
                  if (column.id === "userAnswer") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Chip
                          label={value}
                          sx={{ fontWeight: "bold" }}
                          color={
                            row.answer.toString() == value.toString()
                              ? "success"
                              : "error"
                          }
                        />
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
