import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Grid, IconButton, TextField, ThemeProvider, Typography, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonModal from '../../../Components/Common/CommonModal';
import { useState } from 'react';
import appTheme from '../../../Assets/Theme';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct,updateSingleProduct } from '../../../store/redux/productThunk';
import DeleteModal from '../../../Components/Common/DeleteModal';
import MediaUploader from '../../../Components/Common/MediaUploader';
import { showError } from '../../../Assets/Constants/showNotifier';

export default function ProductsGrid({ list = [] }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const isLoading = useSelector((state)=>state.product.isLoading);
  const dispatch = useDispatch();
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [newProduct, setNewProduct] = React.useState({
    _id: null,
    productName:"",
    price:0,
    discount:0,
});

  const columns = [
    !isMobile && {
      field: 'imageUrl',
      headerName: 'Icon',
      renderCell: (params) => (
        <img
          src={params.row.imageUrl}
          alt="Preview"
          style={{
            width: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #ccc',
          }}
        />
      ),
      flex: 1,
      minWidth: 150,
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'Action',
      headerName: 'Action',
      renderCell: (params) => (
        <>
          <IconButton onClick={()=>{setOpenDelete(true); setDeleteId(params.row._id);}}>
            <DeleteIcon color='error' fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
          <IconButton onClick={()=>handleEditProduct(params.row)}>
            <EditIcon sx={{color:appTheme.colors.primaryDark}} fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>
        </>
      ),
      flex: 1,
      minWidth: 100,
    },
  ].filter(Boolean);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(deleteId));
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setOpenAddProduct(true);
    setNewProduct({_id:product._id,productName:product.name, price:product.price, discount:product.discount});
    setSelectedMedia(product.imageUrl)
  }
  console.log("ssssss",selectedMedia);
  const handleClose = () => {
    setOpenDelete(false)
  }

  const handleSubmit = async() => {
    try{
      const formData = new FormData();
      formData.append("data", JSON.stringify(newProduct));
      formData.append("media", selectedMedia.file);
      dispatch(updateSingleProduct(formData))
    }catch(err){
      showError(err)
    }finally{
      setOpenAddProduct(false)
      // getProducts()
    }
  }
  
  const handleChange = (key, value, type="product") => {
    setNewProduct((prev) => ({
        ...prev,
        [key]: value, 
    }));
  };

  const handleProductClose = () => {
    setOpenAddProduct(false);
  }

  const rows = list.map((item) => ({
    ...item,
    id: item._id,
  }));

  return (
    <Box sx={{ height: isMobile ? 300 : isTablet ? 350 : 400, width: '100%' }}>
        <DataGrid
          rows={rows}
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
        />
      <CommonModal open={openAddProduct} handleClose={handleProductClose} handleSubmit={handleSubmit} header='Add Product' buttonTitle="Add" startIcon ={<EditIcon/>}>
          <Grid container spacing={1}>
              <Grid item xs={6}>
                  <TextField  
                  sx={{width:"100%"}}
                  value={newProduct.productName}
                  onChange={(e)=>handleChange('productName', e.target.value)}
                  variant='outlined' label='Enter Product name' />
              </Grid>
              <Grid item xs={6}>
                  <TextField
                      sx={{width:"100%"}}
                      id="product-price"
                      value={newProduct.price}
                      label="Price"
                      type="number"
                      onChange={(e)=>handleChange('price', e.target.value)}
                  />  
              </Grid>
              <Grid item xs={6}>
                  <TextField
                      sx={{width:"100%"}}
                      value={newProduct.discount}
                      id="product-discount"
                      label="Discount If Any"
                      type="number"
                      onChange={(e)=>handleChange('discount', e.target.value)}
                  />  
              </Grid>
              <Grid item xs={6}>
                  <Box display={'flex'} m={0.5} alignItems={'center'}>
                      <Typography mr={2}>Product Image: </Typography>
                      <MediaUploader selectedMedia={selectedMedia} setSelectedMedia ={setSelectedMedia } />
                  </Box>
              </Grid>
          </Grid>
      </CommonModal>
      <DeleteModal open={openDelete} handleClose={handleClose} handleSubmit={handleDelete} isLoading={isLoading}>
          <Box mt={2} textAlign="center">
                Do you really want to delete this product?
          </Box>
      </DeleteModal>
    </Box>
  );
}
