import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import CommonModal from '../../../Components/Common/CommonModal';

const EditCategoryModal = ({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPreview(initialData.imageUrl || null);
      setFile(null);
    }
  }, [initialData]);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(initialData?.imageUrl || null);
    }
  };

  const submitHandler = () => {
    handleSubmit({
      ...initialData,
      name,
      file,
    });
  };

  return (
    <CommonModal
      open={open}
      handleClose={handleClose}
      handleSubmit={submitHandler}
      header="Edit Category"
      buttonTitle="Update"
      loading={loading}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Category Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Box>
          <Typography variant="body2" fontWeight={500} mb={1}>
            Category Image
          </Typography>
          <Button variant="outlined" component="label">
            Upload Image
            <input hidden accept="image/*" type="file" onChange={onFileChange} />
          </Button>
        </Box>
        {preview && (
          <Box mt={2} textAlign="center">
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: 150,
                maxWidth: '100%',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: 8,
              }}
            />
          </Box>
        )}
      </Box>
    </CommonModal>
  );
};

export default EditCategoryModal;
