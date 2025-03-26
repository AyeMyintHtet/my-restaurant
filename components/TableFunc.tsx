"use client";
import React from "react";
import { Delete, Edit } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { buffetTable } from "@/types/supabase_db.types"; // Adjust the import path
import buffetTableAction from "@/actions/tableAction";
import { useRouter } from "next/navigation";
interface TableFuncProps {
  item: any;
}
const TableFunc = ({ item }: TableFuncProps) => {

  return (
    <div className="flex items-center justify-center gap-2" id={item.id.toString()}>
      <IconButton color="error" className="delete-btn"  >
        <Delete />
      </IconButton>
      <IconButton color="primary" className="edit-btn" >
        <Edit />
      </IconButton>
    </div>
  );
};

export default TableFunc;
