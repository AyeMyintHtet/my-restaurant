"use client";
import buffetTableAction from "@/actions/tableAction";
import ModalCom from "@/components/Modal";
import {
  buffetTable,
  customerTable,
  menuCategoryTable,
  menuItemTable,
  tierListTable,
} from "@/types/supabase_db.types";
import React, { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import menuTableAction from "@/actions/menuAction";
import dashboardAction from "@/actions/dashboardAction";

interface IRestaurantTableModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callApi: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateQrData: React.Dispatch<React.SetStateAction<customerTable | undefined>>;
  tierListData: tierListTable[];
  tableNumberList: buffetTable[];
  rawBuffetTable: customerTable[] | null;
  editData?: Partial<customerTable> | null;
}
const DashboardTableModel = ({
  open,
  setOpen,
  callApi,
  editData,
  tierListData,
  tableNumberList,
  rawBuffetTable,
  setCreateQrData
}: IRestaurantTableModal) => {
  const isEdit = !!editData;
  const Form = ({ defaultValues }: { defaultValues: any }) => {
    const { pending } = useFormStatus();
    const tableList = !isEdit ? tableNumberList
      .filter((tableItem) => {
        return !rawBuffetTable?.some(
          (buffetItem) => buffetItem.table_id === tableItem.id && buffetItem.paid === false
        );
      })
      : tableNumberList;
    return (
      <>
        {isEdit && <input type="hidden" name="id" value={defaultValues.id} />}

        <div className="mb-4">
          <label
            htmlFor="table_id"
            className="block text-sm font-medium text-slate-300"
          >
            Table Number
          </label>
          <select
            id="table_id"
            name="table_id"
            defaultValue={defaultValues.table_id}
            className="mt-1 block w-full px-3 py-2 bg-black/50 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="-" disabled>
              Select a Table
            </option>
            {
              tableList.map((d: buffetTable) => (
                <option key={d.id} value={d.id}>
                  {d.table_no}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="customer_count"
            className="block text-sm font-medium text-slate-300"
          >
            Customer Count
          </label>
          <input
            type="text"
            id="customer_count"
            name="customer_count"
            defaultValue={defaultValues.customer_count}
            className="mt-1 block w-full px-3 py-2 bg-black/50 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tier_id"
            className="block text-sm font-medium text-slate-300"
          >
            Tier List
          </label>
          <select
            id="tier_id"
            name="tier_id"
            defaultValue={defaultValues.tier_id}
            className="mt-1 block w-full px-3 py-2 bg-black/50 border border-slate-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {tierListData.map((cat: tierListTable) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg shadow-amber-900/20"
          disabled={pending}
        >
          {pending ? "Submitting..." : isEdit ? "Update" : "Add"}
        </button>
      </>
    );
  };

  const ModalBody = () => {
    console.log("isEdit", isEdit);
    const action = isEdit
      ? dashboardAction.updateDashboardTableInfo
      : dashboardAction.addDashboardTableInfo;

    const [state, formAction] = useActionState(action, null);
    useEffect(() => {
      if (state?.message === "success") {
        if (state.data.from === 'create') {
          setCreateQrData(state.data)

        }
        console.log("state", state.data);
        console.log("success");
        setOpen(false);
        callApi((prev) => !prev);
      }
    }, [state]);

    return (
      <>
        <form action={formAction} className="max-w-md mx-auto mt-10">
          <Form
            defaultValues={
              editData || { id: "", table_no: "", max_customer: "" }
            }
          />
          <br />
          <br />
          {state?.error && (
            <div className="mb-4 text-red-600 border border-red-300 rounded p-2 bg-red-50">
              <p className="font-semibold">{state.error}</p>
              {state.hint && <p className="text-sm">{state.hint}</p>}
            </div>
          )}
        </form>
      </>
    );
  };

  return (
    <ModalCom
      open={open}
      setOpen={setOpen}
      title={`${isEdit ? "Edit" : "Add"} Table`}
      body={<ModalBody />}
    />
  );
};

export default DashboardTableModel;
