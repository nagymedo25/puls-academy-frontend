import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

// ✨ --- START: The Fix --- ✨
// The component now accepts `confirmText` and `confirmButtonColor` to be truly generic.
const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد',
  confirmButtonColor = 'primary'
}) => {
// ✨ --- END: The Fix --- ✨
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <WarningAmberRoundedIcon sx={{ fontSize: 56, color: `${confirmButtonColor}.main`, mb: 2 }} />
        <Typography variant="h6" component="h2" fontWeight="bold">
          {title}
        </Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose} sx={{ px: 4 }}>
            إلغاء
          </Button>
          {/* ✨ The button now uses the props for its text and color */}
          <Button variant="contained" color={confirmButtonColor} onClick={onConfirm} sx={{ px: 4 }}>
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;