import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, useMediaQuery } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import DeleteModal from '../../../Components/Common/DeleteModal';
import EditCategoryModal from './EditCategoryModal'; // <-- make sure path is correct
import appTheme from '../../../Assets/Theme';
import axios from 'axios';
import apiConstants from '../../../api/Constants';
import { showError, showSuccess } from '../../../Assets/Constants/showNotifier';

export default function ProductList({ list, fetchProducts }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  const deleteProduct = async () => {
    try {
      setDeleteLoading(true);
      const res = await apiConstants.product.deleteCategory(deleteId);
      showSuccess(res.data.message || "SubCateory deleted successfully")
      fetchProducts && fetchProducts();
      handleCloseDelete();
    } catch (error) {
      showError(error || "SubCateory deletion failed")
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditData(product);
  };

  const handleCloseEdit = () => {
    setEditData(null);
  };

  const updateProduct = async (updatedData) => {
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("data", JSON.stringify({ name: updatedData.name }));
      if (updatedData.file) {
        formData.append('media', updatedData.file);
      }

      const res = await apiConstants.product.updateCategory(updatedData.id, formData);
      showSuccess(res.data.message || "SubCateory updated successfully")
      handleCloseEdit();
      fetchProducts && fetchProducts();
    } catch (error) {
      console.error(error);
      showError(error || "SubCateory updation failed")
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    !isMobile && {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      minWidth: 100,
    },
    !isMobile && {
      field: 'imageUrl',
      headerName: 'Icon',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <img
          src={params.row.imageUrl}
          alt="Preview"
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `1px solid ${appTheme.colors.border}`,
          }}
        />
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton component={Link} to={`/products/${params.row.id}`}>
            <VisibilityIcon fontSize={isMobile ? 'small' : 'medium'} sx={{ color: appTheme.colors.primary }} />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize={isMobile ? 'small' : 'medium'} sx={{ color: appTheme.colors.primary }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} sx={{ color: appTheme.colors.danger }} />
          </IconButton>
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <Box sx={{ height: isMobile ? 300 : isTablet ? 350 : 400, width: '100%' }}>
        <DataGrid
          rows={list}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: isMobile ? 3 : isTablet ? 4 : 5,
              },
            },
          }}
          pageSizeOptions={isMobile ? [3, 5] : [5, 10]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />

        <DeleteModal open={openDelete} handleClose={handleCloseDelete} handleDelete={deleteProduct} isLoading={deleteLoading}>
          <Box mt={2} textAlign="center">
            Are you sure you want to delete this product?
          </Box>
        </DeleteModal>
      </Box>

      {/* Edit Modal */}
      <EditCategoryModal
        open={!!editData}
        handleClose={handleCloseEdit}
        handleSubmit={updateProduct}
        initialData={editData}
        loading={editLoading}
      />
    </>
  );
}
