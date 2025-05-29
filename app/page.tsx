"use client";
import dayjs from "dayjs";
import { Add } from "@mui/icons-material";
import dashboardAction from "@/actions/dashboardAction";
import BasicTable from "@/components/Table";
import TableFunc from "@/components/TableFunc";
import {
  buffetTable,
  customerTable,
  tierListTable,
} from "@/types/supabase_db.types";
import { getUser } from "@/utils/getUser";
import React, { useEffect, useMemo, useRef, useState } from "react";
import settingAction from "@/actions/settingAction";
import { Button } from "@mui/material";
import ButtonCom from "@/components/Button";
import SearchAutoComplete from "@/components/SearchAutoComplete";
import buffetTableAction from "@/actions/tableAction";
import BuffetReceipt, {
  BuffetReceiptHandle,
  ReceiptData,
} from "@/components/BuffetReceipt";
import DashboardTableModel from "./dashboardTableModal";
import useTableEventDelegation from "@/hooks/useTableEventDelegation";

const tableHeader = [
  "Table No",
  "Customer Count",
  "Menu Tier",
  "Start Time",
  "End Time",
  "Status",
  "Settings",
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [buffetTable, setBuffetTable] = useState<customerTable[] | null>(null);
  const [rawBuffetTable, setRawBuffetTable] = useState<customerTable[] | null>(
    null
  );
  const [timeLimit, setTimeLimit] = useState<[Number, Number]>([0, 0]);
  const [getTableId, setGetTableId] = useState<string | null>(null);
  const [tableNumberList, setTableNumberList] = useState<buffetTable[]>([]);
  const [rawtableNumberList, setRawTableNumberList] = useState<buffetTable[]>(
    []
  );

  const [buffetReceiptData, setBuffetReceiptData] = useState<ReceiptData>({});
  const [tierListData, setTierListData] = useState<tierListTable[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [editData, setEditData] = useState<Partial<customerTable> | null>(null);
  const receiptRef = useRef<BuffetReceiptHandle>(null);

  useEffect(() => {
    if (getTableId) {
      const res: customerTable[] =
        rawBuffetTable?.filter(
          (item: customerTable) =>
            item.buffet_table.table_no.toString() === getTableId &&
            item.paid === false
        ) || [];
      console.log(
        rawBuffetTable?.filter(
          (item: customerTable) =>
            item.buffet_table.table_no === Number(getTableId)
        )
      );
      setBuffetTable(res);
    } else {
      setBuffetTable(rawBuffetTable);
    }
  }, [getTableId]);
  useEffect(() => {
    fetchCustomerTable();
    fetchTimeSetting();
    fetchBuffetTable();
    fetchTierList();
  }, []);
  useEffect(() => {
    window.addEventListener("click", async(e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("checkout")) {
        console.log("Print button clicked");
        console.log(target);
        const tableId = target.id;
        console.log(tableId);
        console.log(buffetTable);
        const selectedTable = buffetTable?.find(
          (item) => Number(item.id) === Number(tableId)
        );
        if (selectedTable) {
          const calculatedDate = dayjs(selectedTable.created_at);
          const calculatedAmt =
            Number(selectedTable.tier_list.amount) *
            Number(selectedTable.customer_count);
          console.log(calculatedAmt);
          setBuffetReceiptData({
            menuTier: selectedTable.tier_list.name,
            startTime: calculatedDate.format("HH:mm:ss"),
            endTime: calculatedDate
              .add(Number(timeLimit[0]), "hour")
              .add(Number(timeLimit[1]), "minute")
              .format("HH:mm:ss"),
            customerCount: selectedTable.customer_count.toString(),
            cost: calculatedAmt.toString(),
            time: new Date().toLocaleString(),
          });
          setTimeout(() => {
            receiptRef.current?.handlePrint()
          }, 100);
          await dashboardAction.changePaidStatusTable(selectedTable.id)
          await fetchCustomerTable()
        }
      }
    });
    return () => {
      window.removeEventListener("click", () => {});
    };
  }, [buffetTable]);
  const fetchCustomerTable = async () => {
    setIsLoading(true);
    const res = await dashboardAction.getDashboardTableInfo();
    if (res) {
      setBuffetTable(res);
      setRawBuffetTable(res);
    }
    setIsLoading(false);
  };
  const fetchTimeSetting = async () => {
    const res = await settingAction.getTableList("other_info");
    console.log(res);
    const timeSetting = res.find((item: any) => item.name === "time_limit");
    const time = timeSetting?.value.split(":");
    setTimeLimit([time[0], time[1]]);
  };
  const fetchBuffetTable = async () => {
    const res = await buffetTableAction.getBuffetTableInfo();
    setRawTableNumberList(res);
    const obj = res.map((item: buffetTable) => item.table_no.toString());
    setTableNumberList(obj);
  };
  const fetchTierList = async () => {
    const res = await settingAction.getTableList("tier_list");
    setTierListData(res);
  };
  const tableBody = useMemo(() => {
    return (
      buffetTable !== null &&
      buffetTable.map((item: customerTable, id: number) => {
        const calculatedDate = dayjs(item.created_at);
        // console.log(new Date(calculatedDate.toString()));
        return [
          item.buffet_table.table_no,
          item.customer_count,
          item.tier_list.name,
          calculatedDate.format("HH:mm:ss"),
          calculatedDate
            .add(Number(timeLimit[0]), "hour")
            .add(Number(timeLimit[1]), "minute")
            .format("HH:mm:ss"),
          ,
          item.paid ? "Paid" : "Pending",
          <TableFunc key={id} item={item} />,
          item.paid ? <Button
            variant="outlined"
            className="pointer-events-none"
          >
            Printed
          </Button>:
          <Button
          variant="contained"
          id={item.id.toString()}
          className="checkout"
        >
          Print
        </Button>
          ,
        ];
      })
    );
  }, [buffetTable]);

  useTableEventDelegation(".dashboard-menu-table", buffetTable, {
    onEdit: (data) => {
      console.log(data, "data");
      setEditData({
        ...data,
        table_id: data.buffet_table.id,
        customer_count: data.customer_count,
      });
      setIsShowModal(true);
    },
  });
  return (
    <>
      Dashboard
      <BuffetReceipt ref={receiptRef} data={buffetReceiptData} />
      <div className="text-right mb-4 mt-2 flex justify-end items-center gap-3">
        <SearchAutoComplete
          data={tableNumberList}
          setValue={setGetTableId}
          label="Search Table Number"
        />
        <ButtonCom
          text="New Customer"
          variant="contained"
          icon={<Add />}
          onClick={() => [setEditData(null), setIsShowModal(true)]}
        />
      </div>
      <br />
      <BasicTable
        data={tableBody}
        header={tableHeader}
        className="dashboard-menu-table"
        isLoading={isLoading}
      />
      <DashboardTableModel
        open={isShowModal}
        setOpen={setIsShowModal}
        callApi={fetchCustomerTable}
        tierListData={tierListData}
        tableNumberList={rawtableNumberList}
        rawBuffetTable={rawBuffetTable}
        editData={editData || null} // Pass null or appropriate data if editing
      />
    </>
  );
}
