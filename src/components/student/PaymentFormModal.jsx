// src/components/student/PaymentFormModal.jsx
import React, { useState, useEffect } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CourseService from '../../services/courseService';
import PaymentService from '../../services/paymentService';
// ✨ لم نعد بحاجة لـ AuthService هنا
import './PaymentFormModal.css';

const VODAFONE_CASH_NUMBER = 'sdfgdfgdfg';
const INSTAPAY_LINK = 'tryrtyrtytryt';

const PaymentFormModal = ({ open, onClose, onPaymentSuccess, initialCourse }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('vodafone_cash');
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        if (open) {
            // Reset state on open
            setStep(1);
            setMethod('vodafone_cash');
            setError('');
            setScreenshot(null);

            const fetchCourses = async () => {
                try {
                    // ✨ 1. استدعاء الدالة التي تجلب الكورسات مع حالة الاشتراك
                    const response = await CourseService.getAvailableCourses(); 
                    
                    // ✨ 2. فلترة النتائج لعرض الكورسات المتاحة للشراء فقط
                    const purchasableCourses = (response.data.courses || []).filter(
                        course => course.enrollment_status === 'available'
                    );

                    setCourses(purchasableCourses);
                } catch (err) {
                    setError('لا يمكن تحميل قائمة الكورسات المتاحة للشراء.');
                }
            };
            fetchCourses();
            
            if (initialCourse) {
                setSelectedCourseId(initialCourse.course_id);
                setAmount(initialCourse.price);
                setStep(2);
            } else {
                setSelectedCourseId('');
                setAmount('');
            }
        }
    }, [open, initialCourse]);

    const handleCourseChange = (e) => {
        const courseId = parseInt(e.target.value, 10);
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
        if (!screenshot) {
            setError('يرجى رفع صورة الإيصال.');
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
    
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('تم النسخ بنجاح!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    if (!open) return null;

    return (
        <div className="payment-modal-backdrop" onClick={onClose}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">
                    {step === 1 ? 'شراء كورس جديد' : `دفع مبلغ ${amount} ج.م`}
                </h2>

                {step === 1 && (
                    <div className="modal-step">
                        {/* ✨ 3. إضافة رسالة في حال عدم وجود كورسات للشراء */}
                        {courses.length > 0 ? (
                            <select className="modal-select" value={selectedCourseId} onChange={handleCourseChange} required>
                                <option value="" disabled>-- اختر الكورس --</option>
                                {courses.map(course => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.title} ({course.price} ج.م)
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="info-box">
                                <p>لقد قمت بالاشتراك في جميع الكورسات المتاحة حالياً. شكراً لك!</p>
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={onClose}>إلغاء</button>
                            <button className="btn-primary" onClick={() => setStep(2)} disabled={!selectedCourseId || !amount}>
                                متابعة للدفع
                            </button>
                        </div>
                    </div>
                )}
                
                {step === 2 && (
                     <form className="modal-step" onSubmit={handleSubmit}>
                        <div className="payment-methods">
                            <button type="button" className={method === 'vodafone_cash' ? 'active' : ''} onClick={() => setMethod('vodafone_cash')}>فودافون كاش</button>
                            <button type="button" className={method === 'instapay' ? 'active' : ''} onClick={() => setMethod('instapay')}>إنستا باي</button>
                        </div>

                        <div className="payment-instructions">
                            {method === 'vodafone_cash' ? (
                                <div className="info-box">
                                    <p>1. قم بتحويل المبلغ إلى الرقم التالي:</p>
                                    <div className="copy-field">
                                        <span>{VODAFONE_CASH_NUMBER || "الرقم غير متوفر"}</span>
                                        <button type="button" onClick={() => copyToClipboard(VODAFONE_CASH_NUMBER)} aria-label="Copy number">
                                            <ContentCopyIcon fontSize="small" />
                                            {copySuccess && <span className="copy-tooltip">{copySuccess}</span>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="info-box">
                                    <p>1. قم بالدفع باستخدام رابط إنستا باي التالي:</p>
                                    <a href={INSTAPAY_LINK} target="_blank" rel="noopener noreferrer" className="instapay-link">
                                        {INSTAPAY_LINK ? "اضغط هنا للانتقال إلى إنستا باي" : "الرابط غير متوفر"}
                                    </a>
                                </div>
                            )}
                            <p className="instruction-step">2. بعد إتمام الدفع، قم برفع صورة الإيصال (سكرين شوت).</p>
                        </div>

                        <label className="upload-button">
                            <UploadFileIcon />
                            <span>{screenshot ? screenshot.name : 'اختر صورة الإيصال'}</span>
                            <input type="file" hidden onChange={handleFileChange} accept="image/*" required />
                        </label>
                        
                        {error && <div className="modal-error">{error}</div>}
                        
                        <div className="modal-actions">
                            {!initialCourse && <button type="button" className="btn-secondary" onClick={() => setStep(1)}>عودة</button>}
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'جاري الإرسال...' : 'تأكيد ورفع الإيصال'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentFormModal;