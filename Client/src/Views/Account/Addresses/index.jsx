import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Typography, Stack, Paper,
  IconButton, Grid, Card, CardContent, CardActions, Button, Skeleton, Dialog
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import apiConstants from '../../../api/Constants';
import CommonModal from '../../../Components/Common/CommonModal';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddressesPage = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [coords, setCoords] = useState({ lat: 28.61, lon: 77.23 });
  const [editData, setEditData] = useState({ house: '', phone: '', landmark: '' });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!editData.house) newErrors.house = 'Required';
    if (!editData.phone) newErrors.phone = 'Required';
    if (!query) newErrors.query = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setEditData({ house: '', phone: '', landmark: '' });
    setQuery('');
    setErrors({});
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      setCoords({ lat: coords.latitude, lon: coords.longitude });
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
      const data = await res.json();
      if (data?.display_name) {
        setQuery(data.display_name);
        setShowForm(true);
        setIsEditing(false);
        setEditingId(null);
        setEditData({ house: '', phone: '', landmark: '' });
        setErrors({});
      }
    }, () => alert('Location access denied'));
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) return setSuggestions([]);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await res.json();
      setSuggestions(data);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleDelete = async (id) => {
    await apiConstants.address.delete(id);
    setAddresses(prev => prev.filter(a => a._id !== id));
    if (currentAddressId === id) setCurrentAddressId(null);
  };

  const handleEdit = (addr) => {
    setIsEditing(true);
    setEditingId(addr._id);
    setQuery(addr.addressLine);
    setEditData({ house: addr.house, phone: addr.mobile, landmark: addr.landmark });
    setCoords({ lat: addr.lat, lon: addr.lon });
    setShowForm(true);
  };

  const handleSelectSuggestion = (s) => {
    setQuery(s.display_name);
    setCoords({ lat: +s.lat, lon: +s.lon });
    setSuggestions([]);
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: 'User',
      addressLine: query,
      mobile: editData.phone,
      house: editData.house,
      landmark: editData.landmark,
      lat: coords.lat,
      lon: coords.lon,
    };

    if (isEditing && editingId) {
      const res = await apiConstants.address.update(editingId, payload);
      setAddresses(prev => prev.map(a => (a._id === editingId ? res.data.data : a)));
      if (editingId === currentAddressId) setSelectedAddress(res.data.data);
    } else {
      const res = await apiConstants.address.create(payload);
      setAddresses(prev => [...prev, res.data.data]);
      setSelectedAddress(res.data.data);
      setCurrentAddressId(res.data.data._id);
    }

    handleCancel();
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    const res = await apiConstants.address.getAll();
    const list = res.data.data || [];
    setAddresses(list);
    if (!selectedAddress && list.length > 0) {
      setSelectedAddress(list[0]);
      setCurrentAddressId(list[0]._id);
    }
    setLoadingAddresses(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <Box maxWidth="md" mx="auto">
      <Box display={'flex'} justifyContent={'end'}>
        <Button variant="outlined" sx={{ borderRadius: 99, mb: 2 }} onClick={() => setShowForm(true)}>
          + Add New Address
        </Button>
      </Box>

      <CommonModal
        open={showForm}
        handleClose={handleCancel}
        handleSubmit={handleSave}
        header={isEditing ? 'Edit Address' : 'Add New Address'}
        buttonTitle={isEditing ? 'Update Address' : 'Save Address'}
        minWidth={'600px'}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={handleDetectLocation} startIcon={<MyLocationIcon />} fullWidth sx={{ borderRadius: 99 }}>
              Detect My Location
            </Button>
            <TextField
              fullWidth size="small" placeholder="Search delivery location"
              value={query} error={!!errors.query} helperText={errors.query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.600' }} /> }}
            />
          </Stack>

          {suggestions.length > 0 && (
            <Paper sx={{ maxHeight: 200, overflow: 'auto', borderRadius: 1, boxShadow: 3 }}>
              {suggestions.map(s => (
                <Box key={s.place_id} sx={{ p: 1.2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleSelectSuggestion(s)}>
                  {s.display_name}
                </Box>
              ))}
            </Paper>
          )}

          <Box sx={{ height: 200, borderRadius: 1, overflow: 'hidden', boxShadow: 2 }}>
            <MapContainer center={[coords.lat, coords.lon]} zoom={15} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lon]} />
            </MapContainer>
          </Box>

          <TextField size="small" label="Flat / House No *" value={editData.house}
            error={!!errors.house} helperText={errors.house}
            onChange={e => setEditData({ ...editData, house: e.target.value })} fullWidth />
          <TextField size="small" label="Phone Number *" value={editData.phone}
            error={!!errors.phone} helperText={errors.phone}
            onChange={e => setEditData({ ...editData, phone: e.target.value })} fullWidth />
          <TextField size="small" label="Landmark (optional)" value={editData.landmark}
            onChange={e => setEditData({ ...editData, landmark: e.target.value })} fullWidth />
        </Stack>
      </CommonModal>

      {loadingAddresses ? (
        <Stack spacing={2}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} height={80} variant="rectangular" sx={{ borderRadius: 1 }} />
          ))}
        </Stack>
      ) : addresses.length === 0 ? (
        <Stack spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            No saved addresses found.
          </Typography>
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {addresses.map((addr) => (
            <Grid item xs={12} sm={6} key={addr._id}>
              <Card variant="outlined" sx={{ borderRadius: 1, p: 1, boxShadow: 1 }}>
                <CardContent sx={{p:1}}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <HomeIcon color="primary" />
                    {/* <Typography >{addr.name || 'Address'}</Typography> */}
                    <Typography variant="body2">{addr.house}, {addr.addressLine}</Typography>
                  </Stack>
                  <Box display={'flex'} alignItems={'start'} gap={1} my={1}>
                    <PhoneIcon fontSize='small'/> 
                    <Typography variant="caption">{addr.mobile}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{py:0}}>
                  <Button
                    size="small"
                    variant={addr._id === currentAddressId ? "contained" : "outlined"}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setCurrentAddressId(addr._id);
                    }}
                  >
                    {addr._id === currentAddressId ? "Current" : "Use this"}
                  </Button>
                  <IconButton size='small' onClick={() => handleEdit(addr)}><EditIcon /></IconButton>
                  <IconButton size='small' sx={{ml:'0px !important'}} color="error" onClick={() => setConfirmDeleteId(addr._id)}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <Box p={2} minWidth={300}>
          <Typography variant="subtitle1" mb={1}>Confirm Deletion</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Are you sure you want to delete this address? This action cannot be undone.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setConfirmDeleteId(null)} variant="outlined">Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddressesPage;
