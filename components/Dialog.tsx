import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid rgba(255,255,255,0.1)",
        }
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ color: "var(--primary)" }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: "var(--surface-foreground)" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "rgba(255,255,255,0.5)" }}>
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="warning" autoFocus sx={{ bgcolor: "var(--primary)", color: "var(--primary-foreground)" }}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;