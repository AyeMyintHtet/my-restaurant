"use client";
import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import settingAction from "@/actions/settingAction";
import BasicTable from "@/components/Table";
import { Add } from "@mui/icons-material";
import {
  IDatabases,
  menuCategoryTable,
  otherInfoTable,
  tierListTable,
} from "@/types/supabase_db.types";
import ButtonCom from "@/components/Button";
import TableFunc from "@/components/TableFunc";
import useTableEventDelegation from "@/hooks/useTableEventDelegation";
import SettingTableModel, { ModalFormData } from "./settingTableModel";

const tierListHeader = ["ID", "Name", "Amount", ""];
const menuCategoryHeader = ["ID", "Name", ""];
const timeLimitHeader = ["ID", "Time Limit", ""];

const Setting = () => {
  const [tierListData, setTierListData] = useState<tierListTable[]>([]);
  const [timeLimitData, setTimeLimitData] = useState<otherInfoTable[]>();
  const [menuCategoryData, setMenuCategoryData] =
    useState<menuCategoryTable[]>();
  const [open, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalFormData>({
    table: "",
    data: [],
  });

  useEffect(() => {
    fetchTableData();
  }, []);
  useTableEventDelegation(".tier-list", tierListData, {
    onDelete: async (id) => {
      const res = await settingAction.deleteTable("tier_list", id);
      if (res?.message === "success")
        setTierListData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {
      // setEditData(data);
      // setIsShowModal(true);
    },
  });

  useTableEventDelegation(".menu-category-list", menuCategoryData, {
    onDelete: async (id) => {
      const res = await settingAction.deleteTable("menu_category", id);
      if (res?.message === "success")
        setMenuCategoryData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {},
  });

  useTableEventDelegation(".time-limit-list", timeLimitData, {
    onDelete: async (id) => {
      const res = await settingAction.deleteTable("other_info", id);
      if (res?.message === "success")
        setTimeLimitData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {},
  });

  const fetchTierList = async () => {
    const res = await settingAction.getTableList("tier_list");
    setTierListData(res);
  };

  const fetchMenuCategory = async () => {
    const res = await settingAction.getTableList("menu_category");
    setMenuCategoryData(res);
  };
  const fetchTimeLimit = async () => {
    const res = await settingAction.getTableList("other_info");
    setTimeLimitData(
      res?.filter((item: otherInfoTable) => item.name === "time_limit")
    );
  };

  async function fetchTableData() {
    await Promise.all([fetchTierList(), fetchMenuCategory(), fetchTimeLimit()]);
  }

  const tierListBody = useMemo(() => {
    return (
      tierListData !== undefined &&
      tierListData.map((item: tierListTable, id: number) => {
        return [
          id + 1,
          item.name,
          item.amount,
          <TableFunc key={id} item={item} />,
        ];
      })
    );
  }, [tierListData]);
  const timeLimitBody = useMemo(() => {
    return (
      timeLimitData !== undefined &&
      timeLimitData.map((item: otherInfoTable, id: number) => {
        return [id + 1, item.value, <TableFunc key={id} item={item} />];
      })
    );
  }, [timeLimitData]);
  const menuCategoryBody = useMemo(() => {
    return (
      menuCategoryData !== undefined &&
      menuCategoryData.map((item: menuCategoryTable, id: number) => {
        return [id + 1, item.name, <TableFunc key={id} item={item} />];
      })
    );
  }, [menuCategoryData]);

  const addTable = async (tableName: IDatabases) => {
    let obj = [
      {
        inputid: "name",
        name: "Name",
      },
    ];
    if (tableName === "tier_list") {
      obj = [
        {
          inputid: "name",
          name: "Name",
        },
        {
          inputid: "amount",
          name: "Amount",
        },
      ];
    } else if (tableName === "other_info") {
      obj = [
        {
          inputid: "value",
          name: "Time Limit",
        },
      ];
    }

    setModalData({
      table: tableName,
      data: obj,
    });
    setIsOpen(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: "10px" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <div className="flex justify-between items-center mb-2">
              <h2>Tier List</h2>
              <ButtonCom
                text="Add tier"
                variant="contained"
                className="add-tier-list"
                icon={<Add />}
                onClick={() => addTable("tier_list")}
              />
            </div>
            <BasicTable
              header={tierListHeader}
              className="tier-list mb-10"
              data={tierListBody}
            />
            <hr />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <div className="flex justify-between items-center mb-2">
              <h2>Menu Categroy</h2>
              <ButtonCom
                text="Add Menu Category"
                variant="contained"
                className="add-menu-category"
                icon={<Add />}
                onClick={() => addTable("menu_category")}

              />
            </div>

            <BasicTable
              header={menuCategoryHeader}
              className="menu-category-list mb-10"
              data={menuCategoryBody}
            />
            <hr />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <div className="flex justify-between items-center mb-2">
              <h2>Time Limit</h2>
              <ButtonCom
                text="Add Time Limit"
                variant="contained"
                className="add-time-limit"
                icon={<Add />}
                onClick={() => addTable("other_info")}

              />
            </div>
            <BasicTable
              header={timeLimitHeader}
              className="time-limit-list mb-10"
              data={timeLimitBody}
            />
            <hr />
          </Grid>
        </Grid>
      </Box>
      <SettingTableModel
        open={open}
        setOpen={setIsOpen}
        renderField={modalData}
      />
    </>
  );
};

export default Setting;
