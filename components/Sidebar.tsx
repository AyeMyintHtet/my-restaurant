'use client'
import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Home, Settings, People, Menu,TableBar,LogoutRounded } from "@mui/icons-material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter()
  const pathname = usePathname()
  const sidebarList = [
    { text: "Dashboard", icon: <Home />, link: '/' },
    { text: "Table", icon: <TableBar />, link: '/table' },
    { text: "Food Menu", icon: <FastfoodIcon />, link: '/food-menu' },
    { text: "Setting", icon: <Settings />, link: '/setting' },
  ]
  const Logout = async () => {
     const supabase  = await createClient();
     await supabase.auth.signOut()
     window.location.reload()
  }
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" open={open} sx={{
          width: open ? 200 : 100, // Adjust width when collapsed
          flexShrink: 0,
          transition: "width 0.3s ease", // Smooth transition
          "& .MuiDrawer-paper": {
            width: open ? 180 : 60, // Ensure paper also resizes
            transition: "width 0.3s ease",
            overflowX: "hidden", // Prevents content from shifting
          },
        }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}>
          <IconButton onClick={() => setOpen(!open)}>
            <Menu />
          </IconButton>
        </div>
        <List>
          {sidebarList.map((item, index) => (
            <ListItem component="li"  key={index} style={{minHeight:'48px', cursor:'pointer',background: pathname === item.link ?'#c6d3ff' : ''}} onClick={()=> router.push(item.link)}>
              <ListItemIcon style={{minWidth: open ? '56px':'auto'}}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
           <ListItem component="li"  style={{minHeight:'48px', cursor:'pointer'}} onClick={()=> Logout()}>
              <ListItemIcon style={{minWidth: open ? '56px':'auto'}}><LogoutRounded/></ListItemIcon>
              {open && <ListItemText primary={'Logout'} />}
            </ListItem>
        </List>
      </Drawer>

    </div>
  );
};

export default Sidebar;
