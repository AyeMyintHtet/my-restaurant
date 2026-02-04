"use client";
import React, { useMemo, useState } from "react";
import { Add } from "@mui/icons-material";
import menuTableAction from "@/actions/menuAction";
import BasicTable from "@/components/Table";
import TableFunc from "@/components/TableFunc";
import { menuCategoryTable, menuItemTable, tierListTable } from "@/types/supabase_db.types";
import MenuTableModel from "./menuTableModel";
import ButtonCom from "@/components/Button";
import settingAction from "@/actions/settingAction";
import Image from "next/image";
import useTableEventDelegation from "@/hooks/useTableEventDelegation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const tableHeader = [
  "Name",
  "Image",
  "Category",
  "Tier",
  "Available Amount",
  "",
];
const FoodMenu = () => {
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState(false);
  const [editData, setEditData] = useState<Partial<menuItemTable> | null>(null);

  // --- Queries ---
  const { data: foodMenu, isLoading: isMenuLoading } = useQuery({
    queryKey: ["menu_item"],
    queryFn: () => menuTableAction.getMenuTableInfo(),
    staleTime: Infinity,
  });

  const { data: tierListData } = useQuery({
    queryKey: ["tier_list"],
    queryFn: () => settingAction.getTableList("tier_list"),
    staleTime: Infinity,
  });

  const { data: menuCategoryData } = useQuery({
    queryKey: ["menu_category"],
    queryFn: () => settingAction.getTableList("menu_category"),
    staleTime: Infinity,
  });

  // --- Invalidation ---
  const invalidateMenu = () => {
    queryClient.invalidateQueries({ queryKey: ["menu_item"] });
  };

  const tableBody = useMemo(() => {
    return (
      foodMenu?.map((item: menuItemTable, id: number) => {
        return [
          item.name,
          <Image key={id} src={item.image} alt={item.name} width={80} height={80} quality={50} style={{ justifySelf: 'center' }} />,
          item.menu_category.name,
          item.tier_list?.name,
          item.available_amt,
          <TableFunc key={id} item={item} />,
        ];
      })
    );
  }, [foodMenu]);

  useTableEventDelegation(".menu-table", foodMenu, {
    onDelete: async (id) => {
      const res = await menuTableAction.deleteMenuRow(id);
      if (res?.message === "success") invalidateMenu();
    },
    onEdit: (data) => {
      console.log(data, 'dataa');
      setEditData({
        ...data,
        table_no: data.name,
        max_customer: data.available_amt
      })
      setIsShowModal(true)
    },
  });

  return (
    <div>
      <div className="text-right mb-4 mt-2 ">
        <ButtonCom
          text="Add Menu"
          variant="contained"
          icon={<Add />}
          onClick={() => [setEditData(null), setIsShowModal(true)]}
        />
      </div>
      <BasicTable
        data={tableBody}
        header={tableHeader}
        className="menu-table"
        isLoading={isMenuLoading}
      />
      <MenuTableModel
        open={isShowModal}
        setOpen={setIsShowModal}
        callApi={invalidateMenu}
        tierListData={tierListData || []}
        menuCategoryData={menuCategoryData || []}
        editData={editData}
      />
    </div>
  );
};

export default FoodMenu;
