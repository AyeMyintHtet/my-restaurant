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

const tierListHeader = ["ID", "Name", "Amount",""];
const menuCategoryHeader = ["ID", "Name",""];
const timeLimitHeader = ["ID", "Time Limit",""];

const Setting = () => {
  const [tierListData, setTierListData] = useState<tierListTable[]>([]);
  const [timeLimitData, setTimeLimitData] = useState<otherInfoTable[]>();
  const [menuCategoryData, setMenuCategoryData] = useState<menuCategoryTable[]>();

  useEffect(() => {
    fetchTableData();
  }, []);
  // ✅ This is fine because it's top-level inside a component
useTableEventDelegation(".tier-list", tierListData, {
    onDelete: async (id) => {
      const res = await settingAction.deleteTable("tier_list", id);
      if(res?.message === "success") setTierListData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {
      // setEditData(data);
      // setIsShowModal(true);
    },
  });
  
  useTableEventDelegation(".menu-category-list", menuCategoryData, {
    onDelete: async (id) => {
        const res = await settingAction.deleteTable("menu_category", id);
      if(res?.message === "success") setMenuCategoryData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {},
  });
  
  useTableEventDelegation(".time-limit-list", timeLimitData, {
    onDelete: async (id) => {
        const res = await settingAction.deleteTable("other_info", id);
      if(res?.message === "success") setTimeLimitData((prev) => prev?.filter((item) => item.id !== id));
    },
    onEdit: (data) => {},
  });

  async function fetchTableData() {
    const [res1, res2] = await Promise.all([
      settingAction.getTableList("tier_list"),
      settingAction.getTableList("menu_category"),
    //   settingAction.getTableList("other_info"),
    ]);
    setTierListData(res1);
    setMenuCategoryData(res2);
    // setTimeLimitData(res2);
  }

  const tierListBody = useMemo(() => {
    return (
      tierListData !== undefined &&
      tierListData.map((item: tierListTable, id: number) => {
          
          return [id + 1, item.name, item.amount,<TableFunc key={id} item={item} />,];
      })
    );
  }, [tierListData]);

  const timeLimitBody = useMemo(() => {
    return (
      timeLimitData !== undefined &&
      timeLimitData.map((item: otherInfoTable, id: number) => {
        return [id + 1, item.time_limit,<TableFunc key={id} item={item} />];
      })
    );
  }, [timeLimitData]);
  const menuCategoryBody = useMemo(() => {
    return (
      menuCategoryData !== undefined &&
      menuCategoryData.map((item: menuCategoryTable, id: number) => {
        return [id + 1, item.name,<TableFunc key={id} item={item} />];
      })
    );
  }, [menuCategoryData]);


  return (
    <Box sx={{ flexGrow: 1, marginTop: "10px" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <div className="flex justify-between items-center mb-2">
            <h2>Tier List</h2>
            <ButtonCom
              text="Add tier"
              variant="contained"
              icon={<Add />}
              onClick={() => []}
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
              icon={<Add />}
              onClick={() => []}
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
              icon={<Add />}
              onClick={() => []}
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
  );
};

export default Setting;
