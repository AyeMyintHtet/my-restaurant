import React from "react";
import BasicTable from "@/components/Table";
import buffetTableAction from "@/actions/tableAction";
import { buffetTable } from "@/types/supabase_db.types";
import { Delete, Edit } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import TableFunc from "./resturantTable";

const buffetTableHeader = [
  "ID",
  "Table Number",
  "Max Customer",
  "Availability",
  "Action",
];
export default async function Dashboard() {
  const { getTable } = buffetTableAction;

  // const deleteRow = async (id: number) => {
  //   // Perform delete operation
  //   console.log("Deleting row with id:", id);
  // };

  // // Edit function
  // const editRow = async (id: number, item: Partial<buffetTable>) => {
  //   // Perform edit operation
  //   console.log("Editing row with id:", id, "and data:", item);
  // };
  // const res = getTable.map((item: buffetTable, id: number) => {
  //   return [
  //     id + 1,
  //     item.table_no,
  //     item.max_customer,
  //     item.is_used ? (
  //       <p className="text-red-500">Used</p>
  //     ) : (
  //       <p className="text-green-500">Available</p>
  //     ),
  //     <TableFunc
  //       key={id}
  //       id={id}
  //       item={item}
  //       onDelete={deleteRow}
  //       onEdit={editRow}
  //     />,
  //   ];
  // });

  return (
    <div>
      Dashboard
      <br />
      <div className="flex w-full">
        {/* <BasicTable data={res} header={buffetTableHeader} /> */}
      </div>
    </div>
  );
}
