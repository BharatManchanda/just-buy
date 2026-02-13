import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import apiConstants from "../../api/Constants";
import Product from "./Product";
import { addCartProductItem, removeCartProduct } from "../../store/redux/cartThunk";
import { useDispatch } from "react-redux";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import NoDataFound from "../../Components/Common/NoDataFound ";
import CategoryGrid from "./CategoryGrid";

const CategoryProductsPage = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddItem = (id) => dispatch(addCartProductItem(id));
  const handleSubItem = (id) => dispatch(removeCartProduct(id));

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await apiConstants.home.getCategoryProducts(categoryId);
        if (res.data.success) {
          const data = res.data.data;
          setProducts(data.products);
          setCategoryName(data.categoryName);
          setSubcategories(data.subcategories || []);
        }
      } catch (error) {
        console.error("Error fetching category products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={isMobile ? 2 : 4} py={3}>
      <CommonBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: categoryName },
        ]}
      />
      {subcategories.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <CategoryGrid categories={subcategories} />
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {products.length === 0 ? (
        <NoDataFound message={`No products available in "${categoryName}"`} icon="📦" />
      ) : (
        <Grid container spacing={1}>
          {products.map((product) => (
            <Product
              key={product._id}
              product={product}
              handleAddItem={handleAddItem}
              handleSubItem={handleSubItem}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CategoryProductsPage;
