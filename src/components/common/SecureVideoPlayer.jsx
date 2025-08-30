import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import './SecureVideoPlayer.css';
import { Box, Typography } from '@mui/material';

const SecureVideoPlayer = ({ src }) => {
  const playerRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  if (!src) {
    return (
      <Box className="player-wrapper" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
        <Typography color="white">لا يوجد فيديو متاح حاليًا.</Typography>
      </Box>
    );
  }

  return (
    <div className="player-wrapper" onContextMenu={handleContextMenu}>
      <ReactPlayer
        ref={playerRef}
        className="react-player"
        src={src}
        width="100%"
        height="100%"
        controls
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload noplaybackrate',
              disablePictureInPicture: true,
            },
          },
        }}
        onLeavePictureInPicture={() => {
          /* تعامل مع إخراج PiP */
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default SecureVideoPlayer;
