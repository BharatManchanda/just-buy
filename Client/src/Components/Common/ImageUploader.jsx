import React, { useState } from 'react';
import { Box, Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { showError, showSuccess } from '../../Assets/Constants/showNotifier';

const ImageUploader = ({selectedImage, setSelectedImage}) => {
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
      setError('Only JPEG, JPG, and PNG files are allowed.');
      setOpenSnackbar(true);
      setSelectedImage(null);
      return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
      const response = await fetch('http://localhost:5000/api/upload-image', {
          method: 'POST',
          body: formData
      });

      const data = await response.json();
      if (response.ok) {
          setSelectedImage(`http://localhost:5000${data.imageUrl}`);
          showSuccess(data.message)
          setError('');
      } else {
          showError(data.message);
          setError(data.message);
          setOpenSnackbar(true);
        }
      } catch (error) {
    showError(error);
      setError('Error uploading image');
      setOpenSnackbar(true);
  }
};


  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={2} height={'70px'}>
      {!selectedImage && 
      <>
        <input
          accept="image/jpeg, image/jpg, image/png"
          type="file"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button variant="outlined" className="button" color='secondary' component="span" size='small'>
            Choose Image
          </Button>
        </label>
      </>}
      {selectedImage && (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              width: '70px',
              height: '70px',
              borderRadius:"50%", 
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
          />
            <IconButton onClick={handleRemoveImage} >
              <CloseIcon/>
            </IconButton>
        </Box>
      )}

      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ImageUploader;
