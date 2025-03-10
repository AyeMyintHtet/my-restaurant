'use client'
import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Home, Settings, People, Menu } from "@mui/icons-material";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

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
          {[
            { text: "Dashboard", icon: <Home /> },
            { text: "Users", icon: <People /> },
            { text: "Settings", icon: <Settings /> },
          ].map((item, index) => (
            <ListItem component="li"  key={index} style={{minHeight:'48px'}}>
              <ListItemIcon style={{minWidth: open ? '56px':'auto'}}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

    </div>
  );
};

export default Sidebar;
