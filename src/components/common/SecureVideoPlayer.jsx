// src/components/common/SecureVideoPlayer.jsx
import React, { useState, useEffect } from 'react'; // ✨ ١. استيراد useState و useEffect
import ReactPlayer from 'react-player';
import './SecureVideoPlayer.css';
import { Box, Typography } from '@mui/material';

const SecureVideoPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false); // ✨ ٢. إضافة حالة جديدة

  // ✨ ٣. تأخير التشغيل التلقائي قليلاً بعد تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlaying(true);
    }, 500); // تأخير نصف ثانية

    return () => clearTimeout(timer); // تنظيف المؤقت
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  
  if (!url) {
      return (
          <Box className="player-wrapper" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="white">لا يوجد فيديو معاينة متاح حاليًا.</Typography>
          </Box>
      )
  }

  return (
    <div className="player-wrapper">
      <div className="player-overlay" onContextMenu={handleContextMenu} />
      
      <ReactPlayer
        className="react-player"
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playing={playing} // ✨ ٤. تطبيق حالة التشغيل على المشغل
        config={{
          file: {
            forceFile: true,
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
      />
    </div>
  );
};

export default SecureVideoPlayer;