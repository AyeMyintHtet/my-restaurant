'use client'
import { useEffect } from "react";
import { buffetTable, customerTable, menuCategoryTable, menuItemTable, otherInfoTable, tierListTable } from "@/types/supabase_db.types";

type Handlers = {
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (data: any) => void;
};

export default function useTableEventDelegation(
  selector: string,
  dataSource: any,
  { onDelete, onEdit }: Handlers
) {
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
  
      const deleteBtn = target.closest(".delete-btn");
      if (deleteBtn) {
        const id = Number((deleteBtn.parentNode as HTMLElement)?.id);
        if (id && onDelete) {
          await onDelete(id);
        }
      }
  
      const editBtn = target.closest(".edit-btn");
      if (editBtn) {
        const id = Number((editBtn.parentNode as HTMLElement)?.id);
        const data = dataSource?.find((item: any) => item.id === id);
        if (data && onEdit) {
          onEdit(data);
        }
      }
    };
  
    const table = document.querySelector(selector);
    if (!table) return;
  
    const clickHandler = (e: Event) => handleClick(e as MouseEvent);
  
    table.addEventListener("click", clickHandler);
    return () => {
      table.removeEventListener("click", clickHandler);
    };
  }, [selector, dataSource, onDelete, onEdit]);
}