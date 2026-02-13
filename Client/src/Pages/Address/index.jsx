import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  IconButton,
  Modal,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import apiConstants from "../../api/Constants";
import { showError } from "../../Assets/Constants/showNotifier";
import { useSelector } from "react-redux";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddressModal = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [forceOpen, setForceOpen] = useState(false); // 🔒 prevents closing

  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ lat: 28.61, lon: 77.23 });
  const [house, setHouse] = useState("");
  const [phone, setPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [errors, setErrors] = useState({});
  const userState = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log("User in AddressModal:", user);
  /* -------------------- INITIAL LOGIC -------------------- */
  useEffect(() => {
    let saved = null;
    if (user) {
      saved = user.addresses?.[0];
    } 
    if(!saved) {
       saved = localStorage.getItem("guest_location");
       saved = JSON.parse(saved);
    }
    if (saved) {
      setLandmark(saved.addressLine);
      setFullAddress(saved.addressLine);
      setCoords({ lat: saved.lat, lon: saved.lon });
    } else {
      setOpen(true);
      setForceOpen(true); 
    }
  }, []);

  /* -------------------- SEARCH SUGGESTIONS -------------------- */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      
      const data = await res.json();
      const uniqueData = Array.from(
        new Map(data.map(item => [item.display_name, item])).values()
      );
      setSuggestions(uniqueData);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* -------------------- LOCATION DETECT -------------------- */
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation not supported");
      return;
    }

    
    setLoadingDetect(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        console.log("Success");
        setLoadingDetect(true);

        const pos = { lat: coords.latitude, lon: coords.longitude };
        setCoords(pos);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lon}`
        );
        setLoadingDetect(false);

        const data = await res.json();

        if (data?.display_name) {
          setLandmark(data.display_name);
          setFullAddress(data.display_name);
          setSuggestions([]);
        }

        if (!user) {
          localStorage.setItem(
            "guest_location",
            JSON.stringify({
              name: "User",
              addressLine: data.display_name,
              house: "",
              mobile: "",
              landmark: "",
              lat: pos.lat,
              lon: pos.lon,
            })
          );
        }

        setOpen(false);
        setForceOpen(false);
      },
      (err) => {
        console.log("Error in getting location:", err);
        if (err.code === err.PERMISSION_DENIED) {
          setLoadingDetect(false);
          showError("Please allow location access");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };



  /* -------------------- SELECT SUGGESTION -------------------- */
  const selectSuggestion = (s) => {
    console.log("Selected suggestion:", s); 
    // setQuery(s.display_name);
    setCoords({ lat: +s.lat, lon: +s.lon });
    setLandmark(s.display_name);
    setFullAddress(s.display_name);
    setSuggestions([]);
     const guestData = {
      name: "User",
      addressLine: s.display_name,
      house: "",
      mobile: "",
      landmark: "",
      lat: s.lat,
      lon: s.lon,
    };
    localStorage.setItem("guest_location", JSON.stringify(guestData));
    if(!user){
      setOpen(false);
    }
    setForceOpen(false);
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = useCallback(() => {
    const e = {};
    if (!query) e.query = "Required";

    // 🔒 Required only for logged-in user
    if (user) {
      if (!house) e.house = "Required";
      if (!phone) e.phone = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [query, house, phone, user]);

  /* -------------------- SAVE -------------------- */
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: "User",
      addressLine: query,
      house,
      mobile: phone,
      landmark,
      lat: coords.lat,
      lon: coords.lon,
    };

    if (user) {
      await apiConstants.address.create(payload);
    } else {
      localStorage.setItem("guest_location", JSON.stringify(payload));
    }

    setOpen(false);
    setForceOpen(false);
  };

  /* -------------------- MODAL CLOSE CONTROL -------------------- */
  const handleModalClose = () => {
    if (forceOpen) {
      showError("Please select your delivery address first.");
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="text"
        onClick={() => {setOpen(true); setQuery("")}}
        sx={{
          textTransform: "none",
          px: 1,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.1,
          maxWidth: 300,
          overflow: "hidden",
        }}
      >
        <LocationOnIcon fontSize="large" />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography variant="subtitle2" fontWeight={600} noWrap maxWidth={150}>
            Delivered in 9 min
          </Typography>
          <Typography variant="body2" noWrap maxWidth={150} fontSize="11px">
            {isMobile
              ? landmark?.slice(0, 7) + (landmark?.length > 7 ? "..." : "")
              : landmark || "Set Delivery Address"}
          </Typography>
        </Box>
      </Button>

      <Modal
        open={open}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") handleModalClose();
        }}
        disableEscapeKeyDown={forceOpen}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            width: isMobile ? "90%" : 600,
            borderRadius: 1,
            border: "3px solid",
            borderColor: theme.palette.primary.main,
            p: 3,
            pb: 4,
            boxShadow: 10,
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
            scrollbarWidth:'none'
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Location
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search + Detect */}
          <Box display="flex" alignItems="center" flexDirection="row" gap={1}>
            <TextField
              label="Search Address"
              size="small"
              value={query}
              error={!!errors.query}
              helperText={errors.query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              sx={{ flex: 1, width: "100%" }}
            />

            <Typography sx={{ fontWeight: 600, opacity: 0.6 }}>OR</Typography>

            <Button
              variant="contained"
              size="small"
              onClick={handleDetectLocation}
              sx={{ borderRadius: 10, whiteSpace: "nowrap" }}
              startIcon={
                loadingDetect ? (
                  <CircularProgress color="white" size={18} />
                ) : (
                  <MyLocationIcon />
                )
              }
            >
              {loadingDetect ? "Detecting..." : "Detect My Location"}
            </Button>
          </Box>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Paper sx={{ mt: 1, maxHeight: 160, overflowY: "auto" }}>
              {suggestions.map((s) => (
                <Box
                  key={s.place_id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => selectSuggestion(s)}
                >
                  {s.display_name}
                </Box>
              ))}
            </Paper>
          )}

          {/* Logged-in user fields */}
          {/* {user && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="House / Flat *"
                size="small"
                value={house}
                error={!!errors.house}
                helperText={errors.house}
                onChange={(e) => setHouse(e.target.value)}
              />

              <TextField
                label="Phone Number *"
                size="small"
                value={phone}
                error={!!errors.phone}
                helperText={errors.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(value);
                }}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 6 }}>+91</span>,
                }}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[6-9]{1}[0-9]{9}",
                }}
              />

              <TextField
                label="Landmark"
                size="small"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: 10 }}
                onClick={handleSave}
              >
                Save Address
              </Button>
            </Stack>
          )} */}
        </Box>
      </Modal>
    </>
  );
};

export default AddressModal;
