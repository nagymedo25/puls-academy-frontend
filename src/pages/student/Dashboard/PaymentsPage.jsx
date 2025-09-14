// src/pages/student/Dashboard/PaymentsPage.jsx
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentService from '../../../services/paymentService';
import PaymentFormModal from '../../../components/student/PaymentFormModal';
import './PaymentsPage.css';

const PaymentStatusChip = ({ status }) => {
  const statusConfig = {
    approved: { 
      label: 'مقبول', 
      class: 'status-approved', 
      icon: <CheckCircleIcon /> 
    },
    pending: { 
      label: 'قيد المراجعة', 
      class: 'status-pending', 
      icon: <HourglassTopIcon /> 
    },
    rejected: { 
      label: 'مرفوض', 
      class: 'status-rejected', 
      icon: <CancelIcon /> 
    },
  };
  
  const config = statusConfig[status] || { 
    label: status, 
    class: '', 
    icon: <ReceiptIcon /> 
  };
  
  return (
    <div className={`payment-status-chip ${config.class}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

const AbstractShape = ({ style }) => (
  <div className="abstract-shape" style={style} />
);

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await PaymentService.getMyPayments();
      setPayments(response.data.payments || []);
    } catch (err) {
      setError('فشل في تحميل سجل المدفوعات.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };
  
  const filteredPayments = payments.filter(p => activeTab === 'all' || p.status === activeTab);
  
  return (
    <div className="payments-page-container">
      <AbstractShape style={{ width: '200px', height: '200px', top: '5%', right: '-80px' }} />
      <AbstractShape style={{ width: '150px', height: '150px', bottom: '10%', left: '-70px', animationDuration: '25s' }} />
      
      <div className="payments-header">
        <h1 className="payments-title">سجل المدفوعات</h1>
        <button 
          className="add-payment-button" 
          onClick={() => setIsModalOpen(true)}
        >
          <AddCircleIcon />
          إضافة طلب دفع جديد
        </button>
      </div>
      
      <div className="payments-paper">
        <div className="payments-tabs">
          <button 
            className={`payment-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            الكل
          </button>
          <button 
            className={`payment-tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => handleTabChange('approved')}
          >
            المقبولة
          </button>
          <button 
            className={`payment-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            قيد المراجعة
          </button>
          <button 
            className={`payment-tab ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => handleTabChange('rejected')}
          >
            المرفوضة
          </button>
        </div>
        
        {loading ? (
          <div className="page-loader">
            <div className="page-loader-spinner"></div>
          </div>
        ) : error ? (
          <div className="page-error">
            {error}
          </div>
        ) : (
          <div className="payments-grid">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <div 
                  className="payment-card" 
                  key={payment.payment_id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-top">
                    <h3 className="course-title">{payment.course_title}</h3>
                    <PaymentStatusChip status={payment.status} />
                  </div>
                  <div className="card-middle">
                    <p className="amount">
                      {payment.amount} <span className="currency">ج.م</span>
                    </p>
                    <p className="method">
                      {payment.method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستا باي'}
                    </p>
                  </div>
                  <div className="card-bottom">
                    <p className="date">
                      {new Date(payment.created_at).toLocaleDateString('ar-EG', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                    {/* ✨ FIX: Use screenshot_url instead of screenshot_path */}
                    {payment.screenshot_url && (
                      <a 
                        href={payment.screenshot_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="receipt-link"
                      >
                        عرض الإيصال
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <ReceiptIcon />
                </div>
                <p className="empty-text">لا توجد مدفوعات لعرضها في هذا القسم.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <PaymentFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPaymentSuccess={fetchPayments} 
      />
    </div>
  );
};

export default PaymentsPage;