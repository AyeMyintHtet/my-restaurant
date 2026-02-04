"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dashboard,
  RestaurantMenu,
  Settings,
  TableBar,
  Logout,
  ChevronLeft,
  ChevronRight,
  Fastfood
} from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <Dashboard />, path: "/" },
    // { name: "Orders", icon: <Fastfood />, path: "/order" }, // Placeholder path
    { name: "Tables", icon: <TableBar />, path: "/table" }, // Placeholder path
    { name: "Menu", icon: <RestaurantMenu />, path: "/menu" }, // Placeholder path
    { name: "Settings", icon: <Settings />, path: "/setting" }, // Placeholder path
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <aside
      className={`h-screen sticky top-0 left-0 bg-surface border-r border-slate-700 transition-all duration-300 flex flex-col z-50 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary tracking-wide uppercase">
            Buffet <span className="text-white">POS</span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-secondary text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-2 overflow-y-auto w-full px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-amber-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <span className={`transition-colors ${isActive ? "text-primary-foreground" : "group-hover:text-primary"}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="ml-4 font-medium tracking-wide">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-xl transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300 ${collapsed ? "justify-center p-3" : "px-4 py-3"
            }`}
        >
          <Logout fontSize="small" />
          {!collapsed && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
