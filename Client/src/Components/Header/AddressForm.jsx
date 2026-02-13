import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useMap } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);

  return null;
}

export default function AddressForm({
  mode = "add",
  initialData = null,
  onSave,
  onCancel,
}) {
  const [query, setQuery] = useState(initialData?.addressLine || "");
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState({
    lat: initialData?.lat || 28.61,
    lon: initialData?.lon || 77.23,
  });
  const [editData, setEditData] = useState({
    house: initialData?.house || "",
    phone: initialData?.mobile || "",
    landmark: initialData?.landmark || "",
  });
  console.log("initialData", initialData);
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors = {};
    if (!editData.house) newErrors.house = "Required";
    if (!editData.phone) newErrors.phone = "Required";
    if (!query) newErrors.query = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- GEOLOCATION ---------------- */

  const handleDetectLocation = async() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLoading(true);
        setCoords({ lat: coords.latitude, lon: coords.longitude });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
        );
        const data = await res.json();
        setLoading(false);
        if (data?.display_name) setQuery(data.display_name);
      },
      () => alert("Location access denied")
    );
    setLoading(false);
  };

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) return setSuggestions([]);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();
      setSuggestions(data);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSuggestion = (s) => {
    setQuery(s.display_name);
    setCoords({ lat: +s.lat, lon: +s.lon });
    setSuggestions([]);
  };

  /* ---------------- SAVE ---------------- */

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      addressLine: query,
      house: editData.house,
      mobile: editData.phone,
      landmark: editData.landmark,
      lat: coords.lat,
      lon: coords.lon,
      isDefault: isDefault,
    });
  };

  console.log("coords", loading);

  /* ---------------- UI ---------------- */

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {mode === "edit" ? "Edit Address" : "Add Address"}
      </Typography>

      <Stack spacing={1.6}>
        {/* Search + Detect */}
        <Stack direction={{ xs: "column", sm: "column" }} spacing={1}>
          <Button
            variant="outlined"
            onClick={handleDetectLocation}
            startIcon={<MyLocationIcon />}
            fullWidth
            sx={{ borderRadius: 99 }}
          >
            {loading ? 'Detecting...':  'Detect'}
          </Button>

          <TextField
            fullWidth
            size="small"
            placeholder="Search delivery location"
            value={query}
            error={!!errors.query}
            helperText={errors.query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "grey.600" }} />,
            }}
          />
        </Stack>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Paper
            sx={{
              maxHeight: 200,
              overflow: "auto",
              borderRadius: 1.5,
              boxShadow: 3,
            }}
          >
            {suggestions.map((s) => (
              <Box
                key={s.place_id}
                sx={{
                  p: 1.2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </Box>
            ))}
          </Paper>
        )}

        {/* Map */}
        <Box
          sx={{
            height: 200,
            borderRadius: 1.5,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={15}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap lat={coords.lat} lon={coords.lon} />
          <Marker position={[coords.lat, coords.lon]} />
        </MapContainer>
        </Box>

        {/* Fields */}
        <TextField
          size="small"
          label="Flat / House No *"
          value={editData.house}
          error={!!errors.house}
          helperText={errors.house}
          onChange={(e) =>
            setEditData((p) => ({ ...p, house: e.target.value }))
          }
          fullWidth
        />

        <TextField
          size="small"
          label="Phone Number *"
          value={editData.phone}
          error={!!errors.phone}
          helperText={errors.phone}
          onChange={(e) =>
            setEditData((p) => ({ ...p, phone: e.target.value }))
          }
          fullWidth
        />

        <TextField
          size="small"
          label="Landmark (optional)"
          value={editData.landmark}
          onChange={(e) =>
            setEditData((p) => ({ ...p, landmark: e.target.value }))
          }
          fullWidth
        />

        {/* Set Default */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
          }
          label="Set as current address"
        />

        {/* Actions */}
        <Stack direction="row" spacing={1.2} mt={1}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 3 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ borderRadius: 3 }}
            onClick={handleSubmit}
          >
            Save Address
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
