import React, { useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { addCategory, getCategoryList } from '../../../store/redux/categoryThunk';
import ThemeButton from '../../../Components/Common/ThemeButton';
import CommonModal from '../../../Components/Common/CommonModal';
import CategoriesAccordions from './CategoriesAccordions';
import MediaUploader from '../../../Components/Common/MediaUploader';
import { showError } from '../../../Assets/Constants/showNotifier';
import appTheme from '../../../Assets/Theme';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CategoryManager() {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.category);

  const [loading, setLoading] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [newCategory, setNewCategory] = useState({
    category: '',
    isParentCategory: false,
    parentCategory: null,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await dispatch(getCategoryList());
      } catch (err) {
        showError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const getCategories = async () => {
    await dispatch(getCategoryList());
  };

  const handleChange = (key, value) => {
    setNewCategory((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' })); // Clear error on change
  };

  const validateForm = () => {
    const errors = {};
    if (!newCategory.category.trim()) {
      errors.category = 'Category name is required';
    }
    if (newCategory.isParentCategory && !newCategory.parentCategory) {
      errors.parentCategory = 'Please select a parent category';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if(!selectedImage){
      showError('Please upload category image');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(newCategory));
      if (selectedImage?.file) {
        formData.append('media', selectedImage.file);
      }
      await dispatch(addCategory(formData));

      // Reset form
      setNewCategory({
        category: '',
        isParentCategory: false,
        parentCategory: null,
      });
      setSelectedImage(null);
      setFormErrors({});
      setOpenAddCategory(false);
      getCategories();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Box maxWidth="1200px" mx="auto">
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <Breadcrumbs separator="›">
          <Typography color="text.primary" fontWeight="bold">
            Categories
          </Typography>
        </Breadcrumbs>
        <ThemeButton
          label="Create"
          size='small'
          onClick={() => setOpenAddCategory(true)}
          variant="primary"
          icon={<AddIcon />}
        />
      </Box>

      {loading ? (
        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={40} sx={{ my: 1 }} />)
      ) : (
        <CategoriesAccordions getCategories={getCategories} />
      )}

      <CommonModal
        open={openAddCategory}
        handleClose={() => {
          setOpenAddCategory(false);
          setFormErrors({});
        }}
        handleSubmit={handleSubmit}
        header="Add Category"
        buttonTitle="Submit"
        loading={allCategories.isLoading}
        startIcon={<AddIcon />}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter Category Name"
              value={newCategory.category}
              onChange={(e) => handleChange('category', e.target.value)}
              error={!!formErrors.category}
              helperText={formErrors.category}
            />
          </Grid>

          {allCategories?.categories?.length > 0 && (
            <>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newCategory.isParentCategory}
                      onChange={(e) => handleChange('isParentCategory', e.target.checked)}
                    />
                  }
                  label="Belongs to another category?"
                />
              </Grid>

              {newCategory.isParentCategory && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!formErrors.parentCategory}>
                    <InputLabel>Select Parent Category</InputLabel>
                    <Select
                      value={newCategory.parentCategory || ''}
                      onChange={(e) => handleChange('parentCategory', e.target.value)}
                      input={<OutlinedInput label="Select Parent Category" />}
                      MenuProps={MenuProps}
                    >
                      {allCategories.categories.map((cat, idx) => (
                        <MenuItem key={idx} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.parentCategory && (
                      <Typography variant="caption" color="error" mt={0.5}>
                        {formErrors.parentCategory}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography mr={2}>Category Logo:</Typography>
              <MediaUploader selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} />
            </Box>
          </Grid>
        </Grid>
      </CommonModal>
    </Box>
  );
}
