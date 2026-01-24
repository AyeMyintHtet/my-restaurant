"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

interface IModalCom {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  body: React.ReactElement;
  title?: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "var(--surface)", // Use customized surface color
  color: "var(--foreground)", // Ensure text is visible
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
};

export default function ModalCom({ open, setOpen, title, body }: IModalCom) {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen && setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {title && (
            <Typography id="modal-modal-title" variant="h4" component="h2">
              {title}
            </Typography>
          )}
          {body && body}
        </Box>
      </Modal>
    </div>
  );
}
