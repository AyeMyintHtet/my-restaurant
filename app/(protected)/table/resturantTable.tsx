"use client";
import React from "react";
import { Delete, Edit } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { buffetTable } from "@/types/supabase_db.types"; // Adjust the import path

interface TableFuncProps {
  id: number;
  item: buffetTable;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, item: Partial<buffetTable>) => Promise<void>;
}

const TableFunc = ({ id, item, onDelete, onEdit }: TableFuncProps) => {
  // Handle delete button click
  const handleDelete = async () => {
    await onDelete(id);
  };

  // Handle edit button click
  const handleEdit = async () => {
    await onEdit(id, item);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <IconButton color="error" onClick={handleDelete}>
        <Delete />
      </IconButton>
      <IconButton color="primary" onClick={handleEdit}>
        <Edit />
      </IconButton>
    </div>
  );
};

export default TableFunc;