import React from "react";
import Button from "@mui/material/Button";

interface IButton {
  variant: "contained" | "outlined" | "text";
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const ButtonCom = ({ variant, icon, text ,className,onClick}: IButton) => {
  return (
    <Button variant={variant} endIcon={icon} onClick={onClick} className={className}>
      {text}
    </Button>
  );
};

export default ButtonCom;
