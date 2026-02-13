import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Avatar,
  Stack,
  Skeleton,
  useTheme
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import apiConstants from "../../../api/Constants";
import CommonBreadcrumbs from "../../../Components/Common/CommonBreadcrumbs";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const userId = localStorage.getItem("user_id");
  const fetchOrders = async () => {
    try {
      const res = await apiConstants.user.orders(`/orders/${userId}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchOrders();
  }, [userId]);

  return (
    <Box  maxWidth="md" mx="auto">
      {loading ? (
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
      ) : orders.length === 0 ? (
        <Typography variant="body1" mt={2}>
          You haven’t placed any orders yet.
        </Typography>
      ) : (
        orders.map((order, index) => (
          <Card
            key={index}
            sx={{
              mb: 1,
              borderRadius: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              overflow: "hidden",
              transition: "0.3s ease",
              "&:hover": {
                transform: "scale(1.005)",
                boxShadow: "0 6px 30px rgba(0,0,0,0.1)"
              }
            }}
          >
            {/* Order Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: "#fff",
                p: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "#fff", color: "green", width: 32, height: 32 }}>
                  <ShoppingBagIcon fontSize="small" />
                </Avatar>
                <Typography fontSize={14}>
                  Payment ID: <strong>{order.razorpay_payment_id.slice(-8)}</strong>
                </Typography>
              </Stack>

              <Chip
                label={new Date(order.createdAt).toLocaleString()}
                size="small"
                sx={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 500 }}
              />
            </Box>

            {/* Order Body */}
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2}>
                {order.products.map((item, idx) => {
                  const product = item.productId;
                  const pricePerUnit =
                    product.price - (product.price * product.discount) / 100;
                  const totalPrice = pricePerUnit * item.quantity;

                  return (
                    <Grid item xs={12} key={idx}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={product.imageUrl || product.thumbnail || ""}
                            sx={{ width: 30, height: 30, bgcolor: "grey.200" }}
                          />
                          <Box>
                            <Typography fontSize={14} fontWeight={600}>
                              {product.title || "Product Name"}
                            </Typography>
                            <Typography fontSize={13} color="text.secondary">
                              ₹{pricePerUnit.toFixed(2)} × {item.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography fontWeight={600} fontSize={15}>
                          ₹{totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Paid
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={`₹ ${(order.amount).toFixed(2)}`}
                    color="success"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 14,
                      px: 1.5
                    }}
                  />
                  <Chip
                    label={order.orderStatus || "Processing"}
                    color={
                      order.orderStatus === "Delivered"
                        ? "primary"
                        : order.orderStatus === "Cancelled"
                        ? "error"
                        : "warning"
                    }
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 500, fontSize: 13 }}
                  />
                </Stack>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Orders;
