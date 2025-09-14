// src/components/admin/RevenueDetailModal.jsx
import React, { useState, useEffect } from 'react';
import AdminService from '../../services/adminService';

const RevenueDetailModal = ({ open, onClose, onResetSuccess }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getApprovedPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      setError('فشل في جلب بيانات المدفوعات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPayments();
    }
  }, [open]);

  const handleReset = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      await AdminService.resetRevenue();
      onResetSuccess();
    } catch (err) {
      setError('فشل في إعادة تصفير الإيرادات.');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (!open) return null;

  return (
    <>
      {/* Main Modal */}
      <div style={styles.modalOverlay}>
        <div style={styles.modalContainer}>
          {/* Header */}
          <div style={styles.modalHeader}>
            <div>
              <h2 style={styles.modalTitle}>سجل الإيرادات</h2>
              <p style={styles.modalSubtitle}>
                إجمالي الإيرادات المعتمدة: <span style={styles.revenueAmount}>{totalRevenue} ج.م</span>
              </p>
            </div>
            <button 
              onClick={onClose}
              style={styles.closeButton}
              aria-label="إغلاق"
            >
              <svg style={styles.closeIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={styles.modalBody}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
              </div>
            ) : error ? (
              <div style={styles.errorAlert}>
                <div style={styles.errorIcon}>
                  <svg style={styles.errorSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div style={styles.errorMessage}>
                  <p style={styles.errorText}>{error}</p>
                </div>
              </div>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      <th style={styles.tableHeader}>الطالب</th>
                      <th style={styles.tableHeader}>الكورس</th>
                      <th style={styles.tableHeader}>المبلغ</th>
                      <th style={styles.tableHeader}>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.payment_id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{payment.user_name}</td>
                        <td style={styles.tableCell}>{payment.course_title}</td>
                        <td style={styles.tableCell}>{payment.amount} ج.م</td>
                        <td style={styles.tableCell}>{new Date(payment.created_at).toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={styles.modalFooter}>
            <button
              onClick={() => setConfirmOpen(true)}
              style={styles.resetButton}
            >
              <svg style={styles.resetIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              إعادة تصفير الإيرادات
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmModal}>
            <div style={styles.confirmContent}>
              <svg style={styles.confirmIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 style={styles.confirmTitle}>تأكيد إعادة التصفير</h3>
              <p style={styles.confirmMessage}>
                تحذير: هذا الإجراء سيقوم بحذف جميع سجلات المدفوعات والتسجيلات بشكل نهائي. هل أنت متأكد؟
              </p>
            </div>
            <div style={styles.confirmActions}>
              <button
                onClick={() => setConfirmOpen(false)}
                style={styles.cancelButton}
              >
                إلغاء
              </button>
              <button
                onClick={handleReset}
                style={styles.confirmButton}
              >
                نعم، قم بالحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// CSS Styles
const styles = {
  // Main Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  modalSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginTop: '4px',
    margin: 0,
  },
  revenueAmount: {
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  closeIcon: {
    width: '24px',
    height: '24px',
    color: '#6b7280',
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '256px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(59, 130, 246, 0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #ef4444',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    borderRadius: '4px',
  },
  errorIcon: {
    flexShrink: 0,
  },
  errorSvg: {
    width: '20px',
    height: '20px',
    color: '#ef4444',
  },
  errorMessage: {
    marginRight: '12px',
  },
  errorText: {
    fontSize: '14px',
    color: '#b91c1c',
    margin: 0,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  tableHead: {
    backgroundColor: '#f9fafb',
    position: 'sticky',
    top: 0,
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  tableRowHover: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: '16px',
    textAlign: 'right',
    fontSize: '14px',
    color: '#1f2937',
    whiteSpace: 'nowrap',
  },
  modalFooter: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: '0 0 12px 12px',
  },
  resetButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#ef4444',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  resetIcon: {
    width: '20px',
    height: '20px',
    marginLeft: '8px',
  },

  // Confirmation Modal Styles
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: '16px',
  },
  confirmModal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '480px',
  },
  confirmContent: {
    padding: '24px',
    textAlign: 'center',
  },
  confirmIcon: {
    width: '48px',
    height: '48px',
    color: '#ef4444',
    margin: '0 auto 16px',
  },
  confirmTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '16px',
    marginBottom: '8px',
  },
  confirmMessage: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  confirmActions: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px',
    gap: '12px',
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  confirmButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#ef4444',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Add animation keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default RevenueDetailModal;