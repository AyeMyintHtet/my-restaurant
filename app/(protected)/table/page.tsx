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
  "ID",
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
    const res = await buffetTableAction.getBuffetTableInfo();
    setBuffetTable(res);
  }

  const tableBody = useMemo(() => {
    return (
      buffetTable !== null &&
      buffetTable.map((item: buffetTable, id: number) => {
        return [
          id + 1,
          item.table_no,
          item.max_customer,
          item.is_used ? (
            <p className="text-red-500">Used</p>
          ) : (
            <p className="text-green-500">Available</p>
          ),
          <TableFunc key={id} item={item} />,
        ];
      })
    );
  }, [buffetTable]);

  return (
    <div className="mt-5">
      <div className="flex w-full flex-col">
        <div className="text-right mb-4">
          <ButtonCom
            text="Add Table"
            variant="contained"
            icon={<Add />}
            onClick={() => [setEditData(null), setIsShowModal(true)]}
          />
        </div>
        <BasicTable
          data={tableBody}
          header={buffetTableHeader}
          className="restaurant-table"
        />
      </div>
      <RestaurantTableModal
        open={isShowModal}
        setOpen={setIsShowModal}
        callApi={setIsCallApi}
        editData={editData}
      />
    </div>
  );
}
