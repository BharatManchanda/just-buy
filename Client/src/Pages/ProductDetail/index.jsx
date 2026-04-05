import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import apiConstants from "../../api/Constants";
import { addCartProductItem, removeCartProduct } from "../../store/redux/cartThunk";
import { showError, showWarning } from "../../Assets/Constants/showNotifier";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const productCount = useMemo(() => {
    if (!product?._id) return 0;
    const added = cartItems.find((item) => item._id === product._id);
    return added ? added.count : 0;
  }, [cartItems, product?._id]);

  const imageList = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.imageUrl)) return product.imageUrl;
    return product.imageUrl ? [product.imageUrl] : [];
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiConstants.home.getProductById(productId);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          showError("Unable to fetch product details");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        showError(err.response?.data?.message || "Unable to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getCurrentPrice = (discount = 0, total = 0) =>
    (total - (discount * total) / 100).toFixed(2);

  const handleAdd = () => {
    if (!product) return;
    if (productCount >= (product.maxCount || 5)) {
      showWarning("Limit Reached", "center", false);
      return;
    }
    dispatch(addCartProductItem(product));
  };

  const handleSubtract = () => {
    if (!product) return;
    dispatch(removeCartProduct(product._id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box py={4}>
        <Typography variant="h6">Product not found.</Typography>
      </Box>
    );
  }

  return (
    <Box py={{ xs: 1, md: 2 }}>
      <CommonBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          ...(product.category_id?.parentCategory?._id
            ? [{ label: product.category_id.parentCategory.name }]
            : []),
          ...(product.category_id?._id
            ? [{ label: product.category_id.name, to: `/category/${product.category_id._id}` }]
            : []),
          { label: product.name },
        ]}
      />

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 280, sm: 360, md: 420 },
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#f8f8f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={`${process.env.REACT_APP_URL}${imageList[activeImage] || ""}`}
                alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            {imageList.length > 1 && (
              <Box mt={1.5} display="flex" gap={1} flexWrap="wrap">
                {imageList.map((img, idx) => (
                  <Box
                    key={img}
                    component="img"
                    src={`${process.env.REACT_APP_URL}${img}`}
                    alt={`${product.name}-${idx + 1}`}
                    onClick={() => setActiveImage(idx)}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      border: "2px solid",
                      borderColor: idx === activeImage ? "primary.main" : "transparent",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {product.discount > 0 && (
                <Chip label={`${product.discount}% OFF`} color="secondary" size="small" />
              )}
              <Chip label={product.status || "active"} size="small" variant="outlined" />
            </Box>

            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.6rem", md: "2rem" } }}>
              {product.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {product.unit || "Unit not specified"}
            </Typography>

            <Box display="flex" alignItems="baseline" gap={1} mt={2}>
              <Typography variant="h5" color="success.main" fontWeight={700}>
                ₹{getCurrentPrice(product.discount, product.price)}
              </Typography>
              {product.discount > 0 && (
                <Typography variant="body1" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                  ₹{product.price}
                </Typography>
              )}
              {product.mrp && (
                <Typography variant="caption" color="text.secondary">
                  MRP: ₹{product.mrp}
                </Typography>
              )}
            </Box>

            <Typography variant="body1" mt={2.5} color="text.primary">
              {product.description || "No description available."}
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Stock: {typeof product.stock === "number" ? product.stock : "NA"}
            </Typography>

            {productCount > 0 ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "success.main",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <Button onClick={handleSubtract} sx={{ minWidth: 42, color: "success.main", fontSize: 20 }}>
                  −
                </Button>
                <Typography sx={{ px: 2, minWidth: 36, textAlign: "center", fontWeight: 600 }}>
                  {productCount}
                </Typography>
                <Button onClick={handleAdd} sx={{ minWidth: 42, color: "success.main", fontSize: 20 }}>
                  +
                </Button>
              </Box>
            ) : (
              <Button variant="contained" color="success" onClick={handleAdd} sx={{ px: 3, py: 1 }}>
                Add to cart
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductDetail;
