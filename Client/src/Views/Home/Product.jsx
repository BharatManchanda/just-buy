import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { showWarning } from "../../Assets/Constants/showNotifier";
import WatchLaterIcon from '@mui/icons-material/WatchLater';

const Product = ({ product, handleAddItem, handleSubItem }) => {
  const [productCount, setProductCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cartItems = useSelector((state) => state.cart);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  useEffect(() => {
    const added = cartItems.items.find((item) => item._id === product._id);
    setProductCount(added ? added.count : 0);
  }, [cartItems, product._id]);

  const getCurrentPrice = (discount, total) =>
    (total - (discount * total) / 100).toFixed(2);

  const handleAdd = (product) => {
    if (productCount >= product.maxCount) {
      showWarning("Limit Reached", "center", false);
      return;
    }
    handleAddItem(product);
  };

  return (
    <Grid item xs={4} sm={4} md={3} lg={2}>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderColor: "#e0e0e0",
          transition: "box-shadow 0.2s ease-in-out, transform 0.15s",
          "&:hover": {
            // boxShadow: theme.shadows[2],
            // transform: "translateY(-2px)",
          },
        }}
      >
        {/* ---------- Product Image ---------- */}
        <Box
          sx={{
            height: isMobile ? 100 : isTablet ? 100 : 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",

            bgcolor: "#f9f9f9",
            overflow: "hidden",
          }}
        >
          {!imageLoaded && <Skeleton variant="rectangular" width="100%" height="100%" />}
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200x200.png?text=No+Image";
              setImageLoaded(true);
            }}
            sx={{
              display: imageLoaded ? "block" : "none",
              objectFit: "contain",
              maxHeight: "100%",
              transition: "transform 0.25s ease",
              pt:3,
              "&:hover": { transform: "scale(1.05)" },
            }}
          />

          {product.discount > 0 && (
            <Chip
              label={`${product.discount}% OFF`}
              color="secondary"
              size="small"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                fontSize: "10px",
                height: 20,
              }}
            />
          )}
        </Box>

        {/* ---------- Product Info ---------- */}
        <CardContent
          sx={{
            p: isMobile ? 1 : 1,
            pb:"8px !important",
            flexGrow: 1,
          }}
        >
          <Box 
           sx={{
                color: "text.secondary",
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
                fontSize: "11px",
              }}
          >
            <WatchLaterIcon sx={{fontSize:"11px"}}/>
            <Typography
              variant="caption"
            >
              {product.prepTime || "9 min"}
            </Typography>
          </Box>
          <Box sx={{display:'flex', justifyContent:'space-between'}}>
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 600,
              lineHeight: 1.2,
              fontSize: isMobile ? "13px" : "13px",
              color: "text.primary",
            }}
          >
            {product.name}
          </Typography>
            {/* {product.discount > 0 && (
              <Chip
                label={`${product.discount}% OFF`}
                color="error"
                size="small"
                sx={{
                  // position: "absolute",
                  top: 6,
                  left: 6,
                  fontSize: "10px",
                  height: 20,
                }}
              />
            )} */}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mt: 0.3,
              fontSize: "11px",
            }}
          >
            {product.quantity || "100g"}
          </Typography>

          {/* ---------- Price & Add Button ---------- */}
          <Box
            display="flex"
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent= "space-between"
            gap={1}
            mt={0.7}
          >
            <Box display={isMobile ? 'flex' : 'block'} justifyContent={isMobile ? 'space-between' : ''} width={isMobile ? '100%' : ''}>
              {product.discount > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.disabled",
                    mr: 0.5,
                    fontSize: "11px",
                  }}
                >
                  ₹{product.price}
                </Typography>
              )}
              <Typography
                variant="body2"
                fontWeight={600}
                color="success.main"
                component="span"
              >
                ₹{getCurrentPrice(product.discount, product.price)}
              </Typography>
            </Box>

            {productCount > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: theme.palette.success.main,
                  borderRadius: "14px",
                  overflow: "hidden",
                  height: 26,
                }}
              >
                <Button
                  onClick={() => handleSubItem(product._id)}
                  sx={{
                    minWidth: 24,
                    color: "success.main",
                    fontSize: "13px",
                    fontWeight: "bold",
                    px: 0,
                    lineHeight: 1,
                  }}
                >
                  −
                </Button>
                <Typography
                  sx={{
                    px: 1,
                    fontSize: "12px",
                    fontWeight: 500,
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {productCount}
                </Typography>
                <Button
                  onClick={() => handleAdd(product)}
                  sx={{
                    minWidth: 24,
                    color: "success.main",
                    fontSize: "13px",
                    fontWeight: "bold",
                    px: 0,
                    lineHeight: 1,
                  }}
                >
                  +
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="success"
                onClick={() => handleAdd(product)}
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  fontSize: "12px",
                  px: 1.5,
                  py: 0.2,
                  height: 26,
                  minWidth: 70,
                  lineHeight: 1.2,
                }}
              >
                Add
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Product;
