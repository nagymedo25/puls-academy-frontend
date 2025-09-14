// src/pages/auth/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, TextField, CircularProgress, Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const VerifyEmailPage = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await AuthService.verifyEmail({ email, code });
            setSuccess('تم تفعيل الحساب بنجاح! سيتم تحويلك لصفحة تسجيل الدخول.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'فشل التحقق.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleResend = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await AuthService.resendVerification({ email });
            setSuccess('تم إرسال كود جديد.');
        } catch (err) {
            setError(err.response?.data?.error || 'فشل إرسال الكود.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography component="h1" variant="h5">
                    تفعيل الحساب
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    لقد أرسلنا كود تفعيل إلى <strong>{email}</strong>. يرجى إدخاله أدناه.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="كود التفعيل"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoFocus
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'تحقق'}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                </Box>
                <Button onClick={handleResend} disabled={loading}>
                    إعادة إرسال الكود
                </Button>
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;