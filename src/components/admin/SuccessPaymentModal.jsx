// src/components/admin/SuccessPaymentModal.jsx
import React from 'react';
import { Modal, Fade, Backdrop, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './SuccessPaymentModal.css'; // استيراد ملف الـ CSS

const SuccessPaymentModal = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
        >
            <Fade in={open}>
                <Box className="success-modal-box">
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'rgba(0,0,0,0.6)', // لون مقارب للخلفية الفاتحة
                            '&:hover': {
                                color: 'rgba(0,0,0,0.8)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className="checkmark-circle">
                        <div className="checkmark stem"></div>
                        <div className="checkmark kick"></div>
                    </div>
                    <Typography variant="h5" component="h2" sx={{ mt: 3, color: '#4CAF50', fontWeight: 600 }}>
                        تمت الموافقة بنجاح!
                    </Typography>
                    <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                        تم معالجة الدفعة بنجاح.
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default SuccessPaymentModal;