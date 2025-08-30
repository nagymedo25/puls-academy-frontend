// src/components/admin/PendingPaymentsTable.jsx
import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PendingPaymentsTable = ({ payments = [] }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, borderRadius: '16px', mt: 4 }} elevation={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="600">أحدث طلبات الدفع</Typography>
        <Button onClick={() => navigate('/admin/payments')}>
          عرض الكل
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الطالب</TableCell>
              <TableCell>الكورس</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell align="center">الإيصال</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? (
              payments.slice(0, 5).map((payment) => ( // عرض أحدث 5 فقط
                <TableRow key={payment.payment_id}>
                  <TableCell>{payment.user_name}</TableCell>
                  <TableCell>{payment.course_title}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell align="center">
                    <Link href={payment.screenshot_path} target="_blank" rel="noopener noreferrer">
                      عرض
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">لا توجد طلبات معلقة حاليًا.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PendingPaymentsTable;