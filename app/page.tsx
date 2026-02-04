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
  otherInfoTable,
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
import { decrypt, encrypt } from "@/utils/encrypt-decrypt";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const [getTableId, setGetTableId] = useState<string | null>(null);
  const [createQrData, setCreateQrData] = useState<customerTable | undefined>();
  const [buffetReceiptData, setBuffetReceiptData] = useState<ReceiptData>({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [editData, setEditData] = useState<Partial<customerTable> | null>(null);
  const receiptRef = useRef<BuffetReceiptHandle>(null);

  // Filter state for "Archive Prints" functionality
  // If true, we only show unpaid items (active). "Archive Prints" implies hiding the paid ones?
  // The original code: archivePrintedReceipts set table to only unpaid.
  // So: showAll = false (default?) or true? Use filter state.
  const [hidePaid, setHidePaid] = useState(false);

  /* Real-time Overdue Logic */
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Queries ---
  const { data: rawBuffetTable, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboard_table"],
    queryFn: () => dashboardAction.getDashboardTableInfo(),
    staleTime: Infinity,
  });

  const { data: otherInfoData } = useQuery({
    queryKey: ["other_info"],
    queryFn: () => settingAction.getTableList("other_info"),
    staleTime: Infinity,
  });

  const { data: rawTableList } = useQuery({
    queryKey: ["buffet_table"],
    queryFn: () => buffetTableAction.getBuffetTableInfo(),
    staleTime: Infinity,
  });

  const { data: tierListData } = useQuery({
    queryKey: ["tier_list"],
    queryFn: () => settingAction.getTableList("tier_list"),
    staleTime: Infinity,
  });

  // --- Derived State ---
  const timeLimit = useMemo(() => {
    const timeSetting = otherInfoData?.find((item: any) => item.name === "time_limit");
    if (timeSetting) {
      const time = timeSetting.value.split(":");
      return [Number(time[0]), Number(time[1])];
    }
    return [0, 0];
  }, [otherInfoData]);

  const tableNumberList = useMemo(() => {
    return rawTableList?.map((item: buffetTable) => item.table_no.toString()) || [];
  }, [rawTableList]);

  const buffetTable = useMemo(() => {
    if (!rawBuffetTable) return null;
    let data = rawBuffetTable;

    // Filter by Search
    if (getTableId) {
      data = data.filter(
        (item) => item.buffet_table.table_no.toString() === getTableId
      );
      // Original code also filtered by paid=false when searching??
      // "item.buffet_table.table_no.toString() === getTableId && item.paid === false"
      // Let's stick to simple ID search for now, unless original intent was strictly unpaid for search.
      // Re-reading original: "&& item.paid === false". Okay, search only showed unpaid? 
      // That seems specific. Let's keep it mostly faithful but maybe search should show all matching?
      // Let's apply standard filters:
      data = data.filter((item) => item.buffet_table.table_no.toString() === getTableId && item.paid === false);
    }

    // Filter by "Archive" (Hide Paid)
    if (hidePaid) {
      data = data.filter((item) => item.paid === false);
    }

    // If not searching and not hiding paid, show all (rawBuffetTable)
    return data;
  }, [rawBuffetTable, getTableId, hidePaid]);


  // --- Invalidation ---
  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard_table"] });
    // Also invalidate table usage status if we care about "Available/Used"
    queryClient.invalidateQueries({ queryKey: ["buffet_table"] });
  };


  // --- Effects for QR/Receipt ---
  useEffect(() => {
    if (createQrData && tierListData) {
      const { tier_id, created_at, table_id, customer_count } = createQrData;
      const calculatedDate = dayjs(created_at);
      const tier = tierListData.find((item: tierListTable) => item.id === tier_id);
      const encrypted = encrypt(`${tier_id + ',' + created_at.toString() + ',' + table_id + ',' + customer_count}`);
      console.log("Encrypted Data:", encrypted);
      console.log("QR Code:", `${window.location.origin}/customer/${encrypted}`);
      // console.log('decrypted', decrypt(encrypted));
      setBuffetReceiptData({
        menuTier: tier?.name,
        startTime: calculatedDate.format("HH:mm:ss"),
        endTime: calculatedDate
          .add(Number(timeLimit[0]), "hour")
          .add(Number(timeLimit[1]), "minute")
          .format("HH:mm:ss"),
        customerCount: customer_count.toString(),
        time: new Date().toLocaleString(),
        qrCode: `${window.location.origin}/customer/${encrypted}`
      });
      setTimeout(() => {
        receiptRef.current?.handlePrint();
      }, 100);
    }
  }, [createQrData, tierListData, timeLimit]);

  // Click handler delegation
  useEffect(() => {
    window.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("checkout")) {
        console.log("Print button clicked");
        const tableId = target.id;

        // Use rawBuffetTable to find item even if filtered out of view
        const selectedTable = rawBuffetTable?.find(
          (item) => Number(item.id) === Number(tableId)
        );

        if (selectedTable) {
          const calculatedDate = dayjs(selectedTable.created_at);
          const calculatedAmt =
            Number(selectedTable.tier_list.amount) *
            Number(selectedTable.customer_count);

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
            receiptRef.current?.handlePrint();
          }, 100);

          await dashboardAction.changePaidStatusTable(selectedTable.id);
          invalidateDashboard(); // Refresh data
        }
      }
    });
    return () => {
      window.removeEventListener("click", () => { });
    };
  }, [rawBuffetTable, timeLimit]); // Depend on raw data


  const tableBody = useMemo(() => {
    if (!buffetTable) return null;
    return buffetTable.map((item: customerTable, id: number) => {
      const calculatedDate = dayjs(item.created_at);
      const endTime = calculatedDate
        .add(Number(timeLimit[0]), "hour")
        .add(Number(timeLimit[1]), "minute");

      const isOverdue = currentTime.isAfter(endTime) && !item.paid;

      const cells = [
        item.buffet_table.table_no,
        item.customer_count,
        item.tier_list.name,
        calculatedDate.format("HH:mm:ss"),
        endTime.format("HH:mm:ss"),
        item.paid ? "Paid" : "Pending",
        <TableFunc key={id} item={item} />,
        item.paid ? (
          <Button variant="outlined" className="pointer-events-none">
            Printed
          </Button>
        ) : (
          <Button
            variant="contained"
            id={item.id.toString()}
            className="checkout"
          >
            Print
          </Button>
        ),
      ];

      return {
        cells,
        className: isOverdue ? "animate-overdue" : "",
        id: item.id
      };
    });
  }, [buffetTable, timeLimit, currentTime]);


  useTableEventDelegation(".dashboard-menu-table", buffetTable || [], {
    onEdit: (data) => {
      setEditData({
        ...data,
        table_id: data.buffet_table.id,
        customer_count: data.customer_count,
      });
      setIsShowModal(true);
    },
  });

  const archivePrintedReceipts = () => {
    setGetTableId(null);
    setHidePaid(true); // Toggle logic or just set true? Original looked like it just filtered.
    // If we want it to act as a toggle: setHidePaid(!hidePaid)
    // For now, replicating "Filter to unpaid only" behavior.

    // Actually, "Archive Prints" usually means "Move paid items to archive (hide them)".
    // So setting hidePaid to true is correct.
    // To show them again, user needs to clear filter? 
    // The original code was: setBuffetTable(raw.filter(paid === false))
    // It didn't seem to have a "Unarchive" button. 
    // Clearing Search/Filters probably resets it if we implemented it that way.
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen">
      <BuffetReceipt ref={receiptRef} data={buffetReceiptData} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Live Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time table monitoring and management</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchAutoComplete
            data={tableNumberList}
            setValue={(val) => {
              setGetTableId(val);
              setHidePaid(false); // Reset hidePaid when searching? matches original logic roughly
            }}
            label="Search Table"
          />
          <ButtonCom
            text={hidePaid ? "Show All" : "Archive Prints"} // Added toggle UX improvement
            variant="outlined"
            colorType="secondary"
            onClick={() => setHidePaid(!hidePaid)}
          />
          <ButtonCom
            text="New Order"
            variant="contained"
            colorType="primary"
            icon={<Add />}
            onClick={() => [setEditData(null), setIsShowModal(true)]}
          />
        </div>
      </div>

      {/* Main Table Content */}
      <BasicTable
        data={tableBody}
        header={tableHeader}
        className="dashboard-menu-table"
        isLoading={isDashboardLoading}
      />

      <DashboardTableModel
        open={isShowModal}
        setOpen={setIsShowModal}
        callApi={invalidateDashboard}
        setCreateQrData={setCreateQrData}
        tierListData={tierListData || []}
        tableNumberList={rawTableList || []}
        rawBuffetTable={rawBuffetTable || []}
        editData={editData || null}
      />
    </div>
  );
}
