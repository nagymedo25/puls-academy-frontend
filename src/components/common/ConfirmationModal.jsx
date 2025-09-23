// src/components/common/ConfirmationModal.jsx
import React from 'react';
import {
  Modal, Box, Typography, Button, Divider
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const ConfirmationModal = ({ open, onClose, onConfirm, title, message, confirmText = "حذف", loading = false }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <WarningAmberIcon sx={{ fontSize: 50, color: 'warning.main' }} />
        </Box>
        <Typography id="confirmation-modal-title" variant="h5" component="h2" fontWeight="700">
          {title}
        </Typography>
        <Typography id="confirmation-modal-description" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ width: '100px' }}>
            إلغاء
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="error" 
            sx={{ width: '100px' }}
            disabled={loading}
          >
            {loading ? 'جاري الحذف...' : confirmText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;