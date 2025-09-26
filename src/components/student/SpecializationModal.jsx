// src/components/student/SpecializationModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AuthService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const SpecializationModal = ({ open }) => {
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();

  const handleSubmit = async () => {
    if (!specialization) {
      setError('يرجى اختيار تخصصك للمتابعة.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await AuthService.updateSpecialization({ pharmacy_type: specialization });
      setUser(response.data.user); // تحديث بيانات المستخدم في السياق لإغلاق المودال
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ ما.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} aria-labelledby="specialization-modal-title">
      <Box sx={style}>
        <Typography id="specialization-modal-title" variant="h6" component="h2">
          أهلاً بك في كلية الصيدلة!
        </Typography>
        <Typography sx={{ mt: 2 }}>
          يرجى تحديد المنهج الدراسي الذي تتبعه للمتابعة.
        </Typography>
        <FormControl fullWidth sx={{ my: 3 }}>
          <InputLabel id="spec-select-label">التخصص</InputLabel>
          <Select
            labelId="spec-select-label"
            value={specialization}
            label="التخصص"
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <MenuItem value="pharm-d">Pharm-D</MenuItem>
            <MenuItem value="clinical">Clinical</MenuItem>
          </Select>
        </FormControl>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'حفظ ومتابعة'}
        </Button>
      </Box>
    </Modal>
  );
};

export default SpecializationModal;