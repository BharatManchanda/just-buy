import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { showWarning } from '../../Assets/Constants/showNotifier';

const MediaUploader = ({ selectedMedia, setSelectedMedia }) => {
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi'];
    const isImage = validImageTypes.includes(file.type);
    const isVideo = validVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      showWarning('Only JPEG, JPG, PNG images and MP4, MOV, AVI videos are allowed.');
      setSelectedMedia(null);
      return;
    }

    setSelectedMedia({ file, type: isImage ? 'image' : 'video', previewUrl: URL.createObjectURL(file) });
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent={'space-between'} gap={2} minHeight={'70px'}>
      {!selectedMedia && (
        <>
          <input
            accept="image/jpeg, image/jpg, image/png, video/mp4, video/mov, video/avi"
            type="file"
            onChange={handleMediaUpload}
            style={{ display: 'none' }}
            id="media-upload"
          />
          <label htmlFor="media-upload">
            <Button variant="outlined" color='secondary' component="span" size='small' sx={{textTransform:'capitalize'}}>
              Choose Media
            </Button>
          </label>
        </>
      )}

      {selectedMedia && (
          <Box 
          display="flex" 
          flexDirection="row" 
          alignItems="center" 
          position="relative" 
          justifyContent="space-between" 
          gap={1}
          sx={{
            width: { xs: '100%', sm: '80%', md: '60%', lg: '50%' }, // Responsive width
            maxWidth: '500px',
          }}
          >
          {selectedMedia.type === 'video' ? (
            <video
            src={selectedMedia.previewUrl || selectedMedia}
            controls
            style={{
              width: '100%', 
              maxWidth: '400px',
              height: 'auto',
              maxHeight: '300px', 
              objectFit: 'contain',
              border: '1px solid #ccc',
            }}
          />
          ) : (
            <img
            src={selectedMedia.previewUrl || selectedMedia}
            alt="Preview"
            style={{
              width: '100%',  
              maxWidth: '400px',  
              height: 'auto', 
              maxHeight: '300px',   
              objectFit: 'contain',   
              border: '1px solid #ccc',
            }}
          />
          )}

          <IconButton
            sx={{
              // position: 'absolute',
              backgroundColor: 'grey',
              '&:hover': {
                backgroundColor: 'red',
              },
              top: 4, 
              right: 4
            }}
            onClick={handleRemoveMedia}
          >
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
          </Box>
      )}
    </Box>
  );
};

export default MediaUploader;
