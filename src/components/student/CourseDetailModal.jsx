// src/components/student/CourseDetailModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Chip, Divider, Alert } from '@mui/material';
import { keyframes } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupsIcon from '@mui/icons-material/Groups';
import { processVideoUrl } from '../../utils/videoUtils';
import './CourseDetailModal.css'; // استيراد ملف التصميم الجديد

// Animation for modal entrance
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(50px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const CourseStatusChip = ({ status }) => {
    const statusConfig = {
      active: { label: 'مفعّل', color: 'success', icon: <PlayCircleOutlineIcon /> },
      pending: { label: 'قيد المراجعة', color: 'warning', icon: <HourglassTopIcon /> },
      rejected: { label: 'مرفوض', color: 'error', icon: <ReportProblemIcon /> },
      available: { label: 'متاح للشراء', color: 'info', icon: <AttachMoneyIcon /> },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip icon={config.icon} label={config.label} color={config.color} size="small" variant="outlined" />;
};

const CourseDetailModal = ({ open, onClose, course, onBuyNow }) => {
    if (!course) return null;

    // ✨ استخدام دالة معالجة الفيديو الجديدة التي تدعم YouTube و Bunny
    const videoResult = processVideoUrl(course.preview_url);
    const embedSrc = videoResult.embedUrl;
    const videoError = videoResult.error;
    const collegeTypeLabel = course.college_type === 'male' ? 'بنين' : 'بنات';

    return (
        <Modal open={open} onClose={onClose} className="course-detail-modal-container">
            <Box className="course-detail-modal-content" sx={{ animation: `${slideIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)` }}>
                <IconButton onClick={onClose} className="close-button">
                    <CloseIcon />
                </IconButton>

                <Box className="modal-header">
                    <img src={course.thumbnail_url} alt={course.title} className="course-thumbnail" />
                    <Box className="header-overlay">
                        <Typography variant="h5" component="h2" fontWeight={800}>
                            {course.title}
                        </Typography>
                        <Typography variant="h6" color="primary.light" fontWeight={700} sx={{ mt: 1 }}>
                            {course.price} ج.م
                        </Typography>
                    </Box>
                </Box>
                
                <Box className="modal-body">
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                        <Chip icon={<SchoolIcon />} label={course.category === 'pharmacy' ? 'صيدلة' : 'طب أسنان'} variant="filled" color="primary" size="small" />
                        <Chip icon={course.college_type === 'male' ? <PersonOutlineIcon /> : <GroupsIcon />} label={collegeTypeLabel} variant="filled" color="secondary" size="small" />
                        <CourseStatusChip status={course.enrollment_status} />
                    </Box>

                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>وصف الكورس</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                        {course.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {videoError ? (
                        <>
                            <Typography variant="h6" fontWeight={700} gutterBottom>معاينة الكورس</Typography>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                {videoError === 'Unsupported video service. Only YouTube and Bunny.net URLs are supported.'
                                    ? 'نوع رابط الفيديو غير مدعوم حالياً. يُرجى التواصل مع الدعم الفني.'
                                    : 'حدث خطأ في تحميل معاينة الفيديو. يُرجى المحاولة لاحقاً.'}
                            </Alert>
                        </>
                    ) : embedSrc ? (
                        <>
                            <Typography variant="h6" fontWeight={700} gutterBottom>معاينة الكورس</Typography>
                            {/* ✨ استخدام نفس تصميم مشغل الفيديو المتجاوب من صفحة الزائر */}
                            <div className="video-player-wrapper">
                                <iframe
                                    src={embedSrc}
                                    loading="lazy"
                                    title={course.title}
                                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                    allowFullScreen={true}
                                ></iframe>
                            </div>
                        </>
                    ) : null}
                </Box>

                <Box className="modal-footer">
                    {course.enrollment_status === 'available' && (
                        <Button 
                            variant="contained" 
                            size="large" 
                            startIcon={<AttachMoneyIcon />} 
                            fullWidth 
                            onClick={() => onBuyNow(course)}
                            className="buy-now-button"
                        >
                            اشترِ الآن ({course.price} ج.م)
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default CourseDetailModal;   