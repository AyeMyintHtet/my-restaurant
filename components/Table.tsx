"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { buffetTable } from "@/types/supabase_db.types";
import { Delete, Edit } from "@mui/icons-material";


export default function BasicTable({
  data,
  header,
  className,
}: {
  data: any;
  header: string[];
  className?: string;
}) {
  return (
    <TableContainer component={Paper} className={className}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header?.map((h) => (
              <TableCell key={h} align="center">
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data === null ? (
            <TableRow>
              <TableCell colSpan={header.length} align="center">
                ...Loading
              </TableCell>
            </TableRow>
          ): data?.length > 0 ? (
            data?.map((row: any, id: number) => (
              <TableRow
                key={id}
                {...{ 'data-id': row.id }}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.map((item: any, idx: number) => (
                  <TableCell align="center" key={idx}>
                    {item}
                  </TableCell>
                ))}
                {/* <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="center">{row.table_no}</TableCell>
              <TableCell align="center">{row.max_customer}</TableCell>
              <TableCell align="center">{Boolean(row.is_used) ?'Available':'Used'}</TableCell>
              <TableCell align="center"><Delete/><Edit/></TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={header.length} align="center">
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
