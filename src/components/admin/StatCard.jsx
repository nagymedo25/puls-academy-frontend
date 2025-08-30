// src/components/admin/StatCard.jsx
import React from 'react';
import { Paper, Typography, Box, Avatar } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatCard = ({ title, value, icon, color = 'primary', link, navigate, delay = 0 }) => (
    <Paper
      elevation={4}
      onClick={() => link && navigate(link)}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px',
        backgroundColor: 'white',
        opacity: 0,
        animation: `${fadeInUp} 0.6s ease-out ${delay}s forwards`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: link ? 'pointer' : 'default',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: (theme) => `0 10px 20px ${theme.palette[color]?.light || theme.palette.grey[300]}`,
            '& .stat-icon': {
              transform: 'scale(1.15)',
            }
        }
      }}
    >
      <Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="p" fontWeight="700">
          {value}
        </Typography>
      </Box>
      <Avatar
        className="stat-icon"
        sx={{
          backgroundColor: (theme) => theme.palette[color]?.main,
          color: 'white',
          width: 56,
          height: 56,
          transition: 'transform 0.3s',
      }}>
        {icon}
      </Avatar>
    </Paper>
);

export default StatCard;