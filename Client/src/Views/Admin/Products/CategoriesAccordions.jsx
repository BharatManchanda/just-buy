import React, { useState } from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductList from './ProductList';
import DeleteModal from '../../../Components/Common/DeleteModal';
import EditIcon from '@mui/icons-material/Edit';
import EditCategoryModal from './EditCategoryModal';
import apiConstants from '../../../api/Constants';

export default function CategoriesAccordions({getCategories}) {
  const [expanded, setExpanded] = useState('panel0');
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useTheme();
  const allCategories = useSelector((state) => state.category);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleEditClick = (e, categoryId) => {
    e.stopPropagation();
    const category = allCategories.categories.find(cat => cat.id === categoryId);
    setEditData({ id: categoryId, name: category.name, imageUrl: category.imageUrl });
    setOpenEdit(true);
  };

  const handleEditSubmit = async (data) => {
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: data.name }));
      if (data.file) formData.append("media", data.file);

      const result = await apiConstants.product.updateCategory(data.id, formData);

      if (result.data.success) {
        console.log("Category updated successfully");
        getCategories()
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setEditLoading(false);
      setOpenEdit(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setEditLoading(true)
      const result = await apiConstants.product.deleteCategory(deleteId);
      if (result.data.success) {
        console.log("Category deleted successfully");
        getCategories()
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setEditLoading(false);
      setOpenDelete(false);
    }
  };



  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleDeleteClick = (e, categoryId) => {
    e.stopPropagation();
    setDeleteId(categoryId);
    setOpenDelete(true);
  };

  return (
    <Box sx={{borderRadius:0}}>
      {allCategories?.categories?.map((category, idx) => {
        const isExpanded = expanded === `panel${idx}`;
        return (
          <MuiAccordion
            key={category._id || idx}
            expanded={isExpanded}
            onChange={handleChange(`panel${idx}`)}
          >
            <MuiAccordionSummary
              expandIcon={
                <ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }} />
              }
              aria-controls={`panel${idx}d-content`}
              id={`panel${idx}d-header`}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'contain',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    {category.name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={(e) => handleEditClick(e, category.id)} size='small'>
                    <EditIcon sx={{ color: theme.palette.primary }} />
                  </IconButton>
                  <IconButton onClick={(e) => handleDeleteClick(e, category.id)} size='small'>
                    <DeleteIcon sx={{ color: theme.palette.error.main }} />
                  </IconButton>
                </Box>
              </Box>
            </MuiAccordionSummary>

            <MuiAccordionDetails>
              <ProductList list={category.subcategories} fetchProducts={getCategories}/>
            </MuiAccordionDetails>
          </MuiAccordion>
        );
      })}

      <DeleteModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleDelete={handleDeleteConfirm}
        isLoading={editLoading}
      >
        <Box mt={2} textAlign="center">
          Are you sure you want to delete this category along with all its subcategories and associated products?
        </Box>
      </DeleteModal>
      <EditCategoryModal
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        handleSubmit={handleEditSubmit}
        initialData={editData}
        loading={editLoading}
      />
    </Box>
  );
}
