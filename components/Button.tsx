"use client";

import React from "react";
import Button from "@mui/material/Button";

interface IButton {
  variant?: "contained" | "outlined" | "text";
  colorType?: "primary" | "secondary" | "danger" | "success";
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e?: any) => void;
  fullWidth?: boolean;
}

const ButtonCom = ({
  variant = "contained",
  colorType = "primary",
  icon,
  text,
  className = "",
  onClick,
  fullWidth = false
}: IButton) => {

  // Map color modes to simplified styling classes or sx
  const getStyles = () => {
    switch (colorType) {
      case "primary": return "bg-primary text-primary-foreground hover:bg-amber-600";
      case "secondary": return "bg-secondary text-secondary-foreground hover:bg-slate-600";
      case "danger": return "bg-red-600 text-white hover:bg-red-700";
      case "success": return "bg-emerald-600 text-white hover:bg-emerald-700";
      default: return "";
    }
  }

  return (
    <Button
      variant={variant}
      endIcon={icon}
      onClick={onClick}
      fullWidth={fullWidth}
      className={`${className} normal-case font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 ${variant === 'contained' ? getStyles() : 'border-slate-500 text-slate-300 hover:border-primary hover:text-primary'}`}
      sx={{
        borderRadius: "0.75rem",
        textTransform: "none",
        fontFamily: "inherit",
        "&.MuiButton-contained": {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }
      }}
    >
      {text}
    </Button>
  );
};

export default ButtonCom;
