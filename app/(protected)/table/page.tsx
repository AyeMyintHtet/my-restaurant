"use client";
import React, { useEffect, useMemo, useState } from "react";
import BasicTable from "@/components/Table";
import buffetTableAction from "@/actions/tableAction";
import { buffetTable } from "@/types/supabase_db.types";
import { Add } from "@mui/icons-material";
import TableFunc from "../../../components/TableFunc";
import ButtonCom from "@/components/Button";
import RestaurantTableModal from "./restaurantTableModal";
import { useRouter } from "next/navigation";
import useTableEventDelegation from "@/hooks/useTableEventDelegation";

const buffetTableHeader = [
  "Table Number",
  "Max Customer",
  "Availability",
  "Action",
];

export default function Dashboard() {
  const [buffetTable, setBuffetTable] = useState<buffetTable[] | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isCallApi, setIsCallApi] = useState(false);
  const [editData, setEditData] = useState<Partial<buffetTable> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    callApi();
  }, [isCallApi]);

  useTableEventDelegation(".restaurant-table", buffetTable, {
    onDelete: async (id) => {
      const res = await buffetTableAction.deleteBuffetTable(id);
      if (res?.message === "success") setBuffetTable((prev) => prev?.filter((item) => item.id !== id) || null);
    },
    onEdit: (data) => {
      setEditData({
        id: data.id,
        table_no: data.table_no,
        max_customer: data.max_customer,
      });
      setIsShowModal(true);
    },
  });

  async function callApi() {
    setIsLoading(true);
    const res = await buffetTableAction.getBuffetTableInfo();
    setBuffetTable(res);
    setIsLoading(false);
  }

  const tableBody = useMemo(() => {
    if (!buffetTable) return null;
    return buffetTable.map((item: buffetTable, id: number) => {
      return [
        item.table_no,
        item.max_customer,
        item.is_used ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Used</span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Available</span>
        ),
        <TableFunc key={id} item={item} />,
      ];
    });
  }, [buffetTable]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Table Management</h1>
          <p className="text-slate-400 mt-1">Configure restaurant tables and capacities</p>
        </div>

        <div>
          <ButtonCom
            text="Add Table"
            variant="contained"
            colorType="primary"
            icon={<Add />}
            onClick={() => [setEditData(null), setIsShowModal(true)]}
          />
        </div>
      </div>

      <BasicTable
        data={tableBody}
        header={buffetTableHeader}
        className="restaurant-table"
        isLoading={isLoading}
      />

      <RestaurantTableModal
        open={isShowModal}
        setOpen={setIsShowModal}
        callApi={setIsCallApi}
        editData={editData}
      />
    </div>
  );
}
