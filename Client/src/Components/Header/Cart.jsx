import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  SwipeableDrawer,
  IconButton,
  List,
  Divider,
  Chip,
  useTheme,
  Skeleton,
  Paper,
  Stack,
  Radio,
  TextField,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCartDetails } from "../../store/redux/cartThunk";
import { showWarning } from "../../Assets/Constants/showNotifier";
import { addProduct, removeProduct } from "../../store/redux/cartslice";
import apiConstants from "../../api/Constants";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import AddressForm from "./AddressForm";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

export default function Cart({ open, setOpen, setModalType }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const isAuthenticated = useSelector((state) => state.auth.user || state.user.user);

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = cart, 2 = address

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("selectedAddress"));
    if (!stored || !user?.user?.addresses?.length) return null;
    return user.user.addresses.find(addr => addr._id === stored._id) || null;
  });

  console.log("Selected Address in Cart:", selectedAddress, JSON.parse(localStorage.getItem("selectedAddress")), user?.addresses);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ lat: "", lon: "" });
  const [editData, setEditData] = useState({ phone: "", house: "", landmark: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (open) {
      dispatch(getCartDetails());
      setAddresses(user?.user?.addresses || []);
    }
  }, [open, dispatch, user]);

  const toggleDrawer = (status) => () => {
    setOpen(status);
    if (!status) setStep(1);
  };

  const handleAdd = (product, count, max) => {
    if (count >= max) {
      showWarning("Limit Reached", "center", false);
      return;
    }
    dispatch(addProduct(product));
    dispatch(getCartDetails());
  };

  const handleRemove = (id) => {
    dispatch(removeProduct(id));
    dispatch(getCartDetails());
  };

  const getCurrentPrice = (discount, price) =>
    (price - (discount * price) / 100).toFixed(2);

  const handleLogin = () => setModalType("phone");

  const handlePayment = async () => {
    if (!selectedAddress) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load. Please try again.");
    setIsLoading(false);

    try {
      const { data: order } = await apiConstants.user.payment.createOrder({
        amount: cart.total_cost,
      });

      const options = {
        key: "rzp_test_spOg1mtGRCSHCE",
        amount: order.amount,
        currency: "INR",
        name: "Just Buy",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const res = await apiConstants.user.payment.verifyPayment({
            ...response,
            userId: user._id,
            products: cart.items.map((item) => ({
              productId: item._id,
              quantity: item.count,
            })),
            amount: cart.total_cost,
            addressId: selectedAddress._id,
          });

          if (res.data.success) {
            localStorage.removeItem("cart");
            dispatch(clearCart());
            navigate("/thank-you");
          }
        },
        prefill: {
          contact: user?.phoneNumber || "9999999999",
        },
        theme: {
          color: "#308d46",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCancel = () => {
    setShowAddressForm(false);
    setIsEditing(false);
    setEditingId(null);
    setQuery("");
    setEditData({ phone: "", house: "", landmark: "" });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
    setStep(1);
  };

  const renderCartItems = () => (
    <Paper
      elevation={1}
      sx={{
        mb: 1,
        px: 1.5,
        py: 1,
        borderRadius: 1,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <List sx={{ mt: 2 }}>
        {cart.items.map((item) => {
          const unitPrice = getCurrentPrice(item.discount, item.price);
          return (
            <Box
              key={item._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1.2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ borderRadius: 10, objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=80&q=80";
                    }}
                  />
                </Box>
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.weight}
                  </Typography>
                  <Typography fontSize={12.5} fontWeight={500} mt={0.5}>
                    ₹{unitPrice} × {item.count} ={" "}
                    <strong>₹{(item.count * unitPrice).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Stack>
              <Chip
                variant="outlined"
                sx={{ height: 30, borderRadius: 2, fontSize: 13, px: 1.2 }}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      onClick={() => handleRemove(item._id)}
                      sx={{ cursor: "pointer", fontWeight: 700 }}
                    >
                      –
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {item.count}
                    </Typography>
                    <Box
                      onClick={() =>
                        handleAdd(item, item.count, item.maxCount)
                      }
                      sx={{ cursor: "pointer", fontWeight: 700 }}
                    >
                      +
                    </Box>
                  </Box>
                }
              />
            </Box>
          );
        })}
      </List>
    </Paper>
  );

  const renderSkeletons = () => (
    <List sx={{ mt: 2 }}>
      {[...Array(3)].map((_, idx) => (
        <Paper key={idx} sx={{ mb: 1.5, px: 1.5, py: 1.2, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Skeleton
              variant="rectangular"
              width={60}
              height={60}
              sx={{ borderRadius: 1.5 }}
            />
            <Box flexGrow={1}>
              <Skeleton variant="text" width="60%" height={22} />
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="80%" height={18} />
            </Box>
          </Box>
        </Paper>
      ))}
    </List>
  );

  const renderBillDetails = () => (
    <Paper elevation={1} sx={{p: 1.5, borderRadius: 1 }}>
      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
        Bill Details
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={1} fontSize={13}>
        <span>Items Total</span>
        <span>₹{cart.total_cost}</span>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1} fontSize={13}>
        <span>Delivery Charges</span>
        <Box display="flex" alignItems="center">
          <span
            style={{
              textDecoration:
                cart.delivery_charges === 0 ? "line-through" : "",
            }}
          >
            ₹{cart.delivery_charges}
          </span>
          {cart.delivery_charges === 0 && (
            <span
              style={{
                color: theme.palette.success.main,
                marginLeft: 6,
              }}
            >
              FREE
            </span>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1} fontSize={13}>
        <span>Handling Charges</span>
        <span>₹{cart.handling_charges}</span>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box
        display="flex"
        justifyContent="space-between"
        fontWeight={600}
        fontSize={14}
      >
        <span>Grand Total</span>
        <span>
          ₹{(cart.total_cost + cart.handling_charges + cart.delivery_charges).toFixed(2)}
        </span>
      </Box>
    </Paper>
  );

  const renderSelectedAddressCard = () =>
    selectedAddress && (
      <Paper
        elevation={0}
        sx={{
          mb: 1.2,
          p: 1.2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={600} fontSize={13}>
              Delivering to
            </Typography>
            <Typography fontSize={12} color="text.secondary" mt={0.3}>
              {selectedAddress.house},{" "}
              {/* {selectedAddress.landmark && `${selectedAddress.landmark}, `} */}
              {selectedAddress.addressLine.length > 60 ? selectedAddress.addressLine.slice(0, 60)+ '...' : selectedAddress.addressLine}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {selectedAddress.mobile}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2, fontSize: 12 }}
            onClick={() => setStep(2)}
          >
            Change
          </Button>
        </Box>
      </Paper>
    );

  const renderActionButton = () => (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        mt: 1,
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        p: 2,
      }}
    >
      {selectedAddress && renderSelectedAddressCard()}

      {!isAuthenticated ? (
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="small"
          onClick={handleLogin}
          sx={{
            fontSize: { xs: 14, sm: 16 },
            borderRadius: 3,
            py: 1,
            boxShadow: 2,
          }}
        >
          Login to Proceed ₹{cart.total_cost}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="small"
          loading={isLoading}
          onClick={handlePayment}
          sx={{
            fontSize: { xs: 14, sm: 16 },
            borderRadius: 3,
            py: 1,
            boxShadow: 2,
          }}
        >
          {selectedAddress ? "Proceed to Payment" : "Select Address"}
        </Button>
      )}
    </Box>
  );

  const renderEmpty = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      textAlign="center"
      mt={5}
    >
      <Typography color="text.secondary" variant="body1">
        Your cart is empty
      </Typography>
    </Box>
  );

  /* ---------------- ADDRESS STEP UI ---------------- */

  const renderAddressList = () => (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Select Address
        </Typography>
        <IconButton onClick={() => setStep(1)}>
          <CancelRoundedIcon />
        </IconButton>
      </Box>

      {addresses.length === 0 && !showAddressForm ? (
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography color="text.secondary">
            No address found. Add one to continue.
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setShowAddressForm(true)}
            sx={{ borderRadius: 3 }}
          >
            Add New Address
          </Button>
        </Box>
      ) : showAddressForm ? (
        renderAddressForm()
      ) : (
        <>
          <List sx={{ flexGrow: 1 }}>
            {addresses.map((addr) => (
              <Paper
                key={addr._id}
                sx={{
                  mb: 1.2,
                  p: 1.5,
                  borderRadius: 1,
                  border:
                    selectedAddress?._id === addr._id
                      ? `1.5px solid ${theme.palette.success.main}`
                      : `1px solid ${theme.palette.divider}`,
                  cursor: "pointer",
                }}
                onClick={() => handleSelectAddress(addr)}
              >
                <Box display="flex" justifyContent="space-between" gap={1}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Radio
                      checked={selectedAddress?._id === addr._id}
                      size="small"
                    />
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={600} fontSize={13}>
                          {addr.house}
                        </Typography>
                        {addr.isDefault && (
                          <Chip
                            label="Current"
                            size="small"
                            color="success"
                            sx={{ height: 20, fontSize: 11 }}
                          />
                        )}
                      </Stack>
                      <Typography fontSize={12} color="text.secondary" mt={0.3}>
                        {addr.landmark && `${addr.landmark}, `}
                        {addr.addressLine}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {addr.mobile}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Stack spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addr);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    {!addr.isDefault && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(addr);
                        }}
                      >
                        <StarBorderRoundedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </List>

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            sx={{ mt: 1.5, borderRadius: 3 }}
            onClick={() => setShowAddressForm(true)}
          >
            Add New Address
          </Button>
        </>
      )}
    </Box>
  );

  const handleEditAddress = (addr) => {
    setIsEditing(true);
    setEditingId(addr._id);
    setShowAddressForm(true);
    setQuery(addr.addressLine);
    setCoords({ lat: addr.lat, lon: addr.lon });
    setEditData({
      house: addr.house,
      phone: addr.mobile,
      landmark: addr.landmark,
      isDefault: addr.isDefault || false,
    });
  };

  const handleSetDefault = async (addr) => {
    try {
      const res = await apiConstants.address.update(addr._id, {
        isDefault: true,
      });

      const updated = res.data.data;

      setAddresses((prev) =>
        prev.map((a) =>
          a._id === updated._id
            ? updated
            : { ...a, isDefault: false }
        )
      );

      setSelectedAddress(updated);
      localStorage.setItem("selectedAddress", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };


  const renderAddressForm = () => (
    <AddressForm
      mode={isEditing ? "edit" : "add"}
      initialData={
        isEditing
          ? {
              addressLine: query,
              house: editData.house,
              mobile: editData.phone,
              landmark: editData.landmark,
              lat: coords.lat,
              lon: coords.lon,
              isDefault: editData.isDefault || false,
            }
          : null
      }
      onCancel={handleCancel}
      onSave={async (payload) => {
        const apiPayload = { name: "User", ...payload };

        if (isEditing && editingId) {
          const res = await apiConstants.address.update(editingId, apiPayload);
          const updated = res.data.data;

          setAddresses((prev) =>
            prev.map((a) => (a._id === editingId ? updated : a))
          );

          if (editingId === selectedAddress?._id || updated.isDefault) {
            setSelectedAddress(updated);
            localStorage.setItem("selectedAddress", JSON.stringify(updated));
          }
        } else {
          const res = await apiConstants.address.create(apiPayload);
          const created = res.data.data;

          setAddresses((prev) => [...prev, created]);
          setSelectedAddress(created);
          localStorage.setItem("selectedAddress", JSON.stringify(created));
        }

        handleCancel();
        setStep(1);
      }}
    />
  );


  /* ---------------- CART STEP UI ---------------- */

  const renderCart = () => (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          My Cart
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CancelRoundedIcon />
        </IconButton>
      </Box>

      {cart.isLoading ? (
        renderSkeletons()
      ) : cart.items.length > 0 ? (
        <>
          {renderCartItems()}
          {renderBillDetails()}
          {renderActionButton()}
        </>
      ) : (
        renderEmpty()
      )}
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      {step === 1 ? renderCart() : renderAddressList()}
    </SwipeableDrawer>
  );
}
