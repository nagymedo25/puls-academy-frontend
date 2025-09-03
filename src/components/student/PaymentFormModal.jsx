// src/components/student/PaymentFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CourseService from '../../services/courseService';
import PaymentService from '../../services/paymentService';
import AuthService from '../../services/authService';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh', // ✨ إضافة لضمان إمكانية التمرير
    overflowY: 'auto', // ✨ إضافة لضمان إمكانية التمرير
};

// ✨ إضافة prop جديد: initialCourse
const PaymentFormModal = ({ open, onClose, onPaymentSuccess, initialCourse }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(''); // ✨ تغيير الاسم لتمييزه عن الكائن
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('vodafone_cash');
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            const fetchCourses = async () => {
                try {
                    // ✨ 2. جلب بيانات المستخدم أولاً
                    const profileRes = await AuthService.getProfile();
                    const userCollege = profileRes.data.user.college;

                    // ✨ 3. طلب الكورسات بناءً على كلية المستخدم
                    const response = await CourseService.getAllCourses({ category: userCollege }); 
                    setCourses(response.data.courses || []);
                } catch (err) {
                    setError('لا يمكن تحميل قائمة الكورسات.');
                }
            };
            fetchCourses();
            
            if (initialCourse) {
                setSelectedCourseId(initialCourse.course_id);
                setAmount(initialCourse.price);
            } else {
                setSelectedCourseId('');
                setAmount('');
            }
            setScreenshot(null); 
            setError(''); 
        }
    }, [open, initialCourse]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        const course = courses.find(c => c.course_id === courseId);
        setSelectedCourseId(courseId);
        if (course) {
            setAmount(course.price);
        } else {
            setAmount('');
        }
    };
    
    const handleFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourseId || !amount || !method || !screenshot) {
            setError('يرجى ملء جميع الحقول ورفع صورة الإيصال.');
            return;
        }
        
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('course_id', selectedCourseId);
        formData.append('amount', amount);
        formData.append('method', method);
        formData.append('screenshot', screenshot);

        try {
            await PaymentService.createPayment(formData);
            onPaymentSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'حدث خطأ أثناء إرسال الطلب.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" fontWeight="700" mb={3}>إنشاء طلب دفع جديد</Typography>
                
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>اختر الكورس</InputLabel>
                    <Select 
                        value={selectedCourseId} // ✨ استخدام selectedCourseId
                        label="اختر الكورس" 
                        onChange={handleCourseChange}
                        disabled={!!initialCourse} // ✨ تعطيل الاختيار إذا كان الكورس محددًا مسبقًا
                    >
                        {courses.map(course => (
                            <MenuItem key={course.course_id} value={course.course_id}>
                                {course.title} ({course.price} ج.م)
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField 
                    label="المبلغ" 
                    value={amount} 
                    fullWidth 
                    margin="normal" 
                    InputProps={{ readOnly: true }} // المبلغ للقراءة فقط
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>طريقة الدفع</InputLabel>
                    <Select value={method} label="طريقة الدفع" onChange={(e) => setMethod(e.target.value)}>
                        <MenuItem value="vodafone_cash">فودافون كاش</MenuItem>
                        <MenuItem value="instapay">إنستا باي</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2, py: 1.5 }} startIcon={<UploadFileIcon />}>
                    {screenshot ? screenshot.name : 'رفع صورة الإيصال'}
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </Button>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose} color="inherit">إلغاء</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'إرسال الطلب'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PaymentFormModal;