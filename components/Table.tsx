"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Inbox } from "@mui/icons-material";

export default function BasicTable({
  data,
  header,
  className,
  isLoading,
}: {
  data: any;
  header: string[];
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <TableContainer
      component={Paper}
      className={`${className} bg-surface border border-slate-700 shadow-xl rounded-2xl overflow-hidden`}
      sx={{ backgroundColor: "var(--surface)", backgroundImage: "none" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className="bg-slate-900/50">
          <TableRow>
            {header?.map((h) => (
              <TableCell
                key={h}
                align="center"
                sx={{
                  color: "var(--primary)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  py: 3
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={header.length} align="center" className="py-20">
                <Box className="flex flex-col items-center justify-center space-y-4 text-slate-400">
                  <CircularProgress color="primary" />
                  <Typography variant="body2">Loading data...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : data === null || data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={header.length} align="center" className="py-20">
                <Box className="flex flex-col items-center justify-center space-y-4 text-slate-500 opacity-50">
                  <Inbox sx={{ fontSize: 60 }} />
                  <Typography variant="body1">No Records Found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data?.map((row: any, id: number) => (
              <TableRow
                key={id}
                {...{ 'data-id': row.id }}
                className="hover:bg-slate-700/30 transition-colors duration-150 group"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.map((item: any, idx: number) => (
                  <TableCell
                    align="center"
                    key={idx}
                    sx={{
                      color: "var(--surface-foreground)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      py: 2.5
                    }}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
