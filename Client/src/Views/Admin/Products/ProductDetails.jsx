import { Box, Grid, Skeleton, TextField, Typography } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ThemeButton from "../../../Components/Common/ThemeButton";
import CommonModal from "../../../Components/Common/CommonModal";
import ImageUploader from "../../../Components/Common/ImageUploader";
import { showError } from "../../../Assets/Constants/showNotifier";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from "react";
import { addProduct } from "../../../store/redux/categoryThunk";
import ProductsGrid from "./ProductsGrid";
import { getProductsList } from "../../../store/redux/productThunk";
import { Breadcrumbs } from "@mui/material";
import MediaUploader from "../../../Components/Common/MediaUploader";
import appTheme from "../../../Assets/Theme";
const variants = ['h1', 'h1', 'h1', 'h1'];

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const productList = useSelector((state)=>state.product);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [newProduct, setNewProduct] = React.useState({
    categoryId:id,
    productName:"",
    price:0,
    discount:0 
});
useEffect(()=>{
  getProducts();
},[])

const getProducts = async () => {
  setLoading(true)
  try {
    await dispatch(getProductsList({id:id}))
  } catch (err) {
    console.error('Error fetching products:', err);
  } finally {
    setLoading(false)
  }
};
  useEffect(() => {
    if(openAddProduct){
      setNewProduct((prev) => ({
          ...prev,
          imageUrl: selectedImage, 
      }));
    }
  }, [selectedImage]);

    const handleSubmit = async() => {
      try{
        const formData = new FormData();
        formData.append("data", JSON.stringify(newProduct));
        formData.append("media", selectedMedia.file);
        dispatch(addProduct(formData))
      }catch(err){
        showError(err)
      }finally{
        setOpenAddProduct(false)
        getProducts()
      }
    }

    const handleProduct = () => {
      setOpenAddProduct(true);
    }
    const handleProductClose = () => {
        setOpenAddProduct(false);
    }

    const handleChange = (key, value, type="product") => {
          setNewProduct((prev) => ({
              ...prev,
              [key]: value, 
          }));
    };
  return (
    <Box maxWidth={'1200px'} p={3}>
      <Box mb={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link to="/admin/categories" style={{ textDecoration: 'none', color: '#0c8342', fontWeight: 'bold' }}>
          Categories
        </Link>
        <Typography color="textPrimary" sx={{ fontWeight: 'bold' }}>{productList?.categoryName?.name || 'Products'}</Typography>
      </Breadcrumbs>

        <Box display={'flex'} gap={2}>
            <ThemeButton label = {'Product'} onClick={handleProduct} variant = 'primary'  icon={<AddIcon/>}/>
        </Box>
      </Box>
      <CommonModal open={openAddProduct} handleClose={handleProductClose} handleSubmit={handleSubmit} header='Add Product' buttonTitle="Add" startIcon ={<AddIcon/>}>
          <Grid container spacing={1}>
              <Grid item xs={6}>
                  <TextField  
                  sx={{width:"100%"}}
                  onChange={(e)=>handleChange('productName', e.target.value)}
                  variant='outlined' label='Enter Product name' />
              </Grid>
              <Grid item xs={6}>
                  <TextField
                      sx={{width:"100%"}}
                      id="product-price"
                      label="Price"
                      type="number"
                      onChange={(e)=>handleChange('price', e.target.value)}
                  />  
              </Grid>
              <Grid item xs={6}>
                  <TextField
                      sx={{width:"100%"}}
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

                      {/* <ImageUploader selectedImage={selectedImage} setSelectedImage={setSelectedImage}/> */}
                  </Box>
              </Grid>
          </Grid>
      </CommonModal>
        {/* {productList?.categoryName?.name && (
          <Typography variant="h5" fontWeight={700} color={`${appTheme.colors.primary}80`}>
            Products of <br /> {productList.categoryName.name}
          </Typography>
        )} */}
      {loading ? variants.map((variant) => (
            <Typography component="div" key={variant} variant={variant}>
              {loading && <Skeleton />}
            </Typography>
          ))
        :
      <ProductsGrid list={productList.products}/>
      }
    </Box>
    
  );
}

export default ProductDetails;
