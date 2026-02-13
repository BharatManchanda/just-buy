import React, { useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Typography,
  CircularProgress,
  ThemeProvider,
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUsersList,
  deleteUserById,
  updateUser,
  createUser,
} from '../../../store/redux/adminUsersThunk';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CommonModal from '../../../Components/Common/CommonModal';
import CustomTextField from '../../../Components/Common/CustomTextField';
import CommonChip from '../../../Components/Common/CommonChip';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.adminUsers.list || []);
  const loading = useSelector((state) => state.adminUsers.loading);
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    userRole: 'admin',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      password: '',
      userRole: user.userRole || 'admin',
    });
    setIsDeleteMode(false);
    setIsCreateMode(false);
    setOpenModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteMode(true);
    setIsCreateMode(false);
    setOpenModal(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      email: '',
      phoneNumber: '',
      password: '',
      userRole: 'admin',
    });
    setIsCreateMode(true);
    setIsDeleteMode(false);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!isDeleteMode){
        if (!formData.email || !emailRegex.test(formData.email)) {
          newErrors.email = 'Valid email is required';
        }
    
        if (
          !formData.phoneNumber ||
          formData.phoneNumber.toString().length !== 10
        ) {
          newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
    
        if (isCreateMode && (!formData.password || formData.password.length < 6)) {
          newErrors.password = 'Password must be at least 6 characters';
        }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (isDeleteMode) {
      dispatch(deleteUserById(selectedUser._id)).then(() => {
        setOpenModal(false);
        dispatch(getUsersList());
      });
    } else if (isCreateMode) {
      dispatch(createUser(formData)).then(() => {
        setOpenModal(false);
        dispatch(getUsersList());
      });
    } else {
        const payload = {email:formData.email, phoneNumber:formData.phoneNumber}
        dispatch(updateUser({ id: selectedUser._id, data: payload })).then(() => {
        setOpenModal(false);
        dispatch(getUsersList());
      });
    }
  };

  const columns = [
    {
      field: '_id',
      headerName: 'User ID',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'Email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => row?.email || '—',
    },
    {
      field: 'Phone',
      headerName: 'Phone',
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => row?.phoneNumber?.toString() || '—',
    },
    {
      field: 'userRole',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <CommonChip label={params.row.userRole || 'user'} />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1.2,
      minWidth: 180,
      valueGetter: (value, row) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleString() : '—',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box maxWidth="1200px" mx="auto">
      <Breadcrumbs separator="›" sx={{ mb: 2 }}>
        <Typography color="text.primary" fontWeight="bold">
          Users
        </Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={2} height={500}>
            <DataGrid
              rows={users}
              getRowId={(row) => row?._id}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
        </Box>
      )}

      <CommonModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleSubmit={handleSubmit}
        loading= {loading}
        header={
          isDeleteMode
            ? 'Confirm Delete'
            : isCreateMode
            ? 'Create Admin User'
            : 'Edit User'
        }
        buttonTitle={
          isDeleteMode ? 'Delete' : isCreateMode ? 'Create' : 'Update'
        }
        isDeleteModel={isDeleteMode}
      >
        {isDeleteMode ? (
          <Typography>Are you sure you want to delete this user?</Typography>
        ) : (
          <>
            <CustomTextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
            <CustomTextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              type="number"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
            {isCreateMode && (
              <>
                <CustomTextField
                  label="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password}
                />
                <CustomTextField
                  label="User Role"
                  value={formData.userRole}
                  disabled
                />
              </>
            )}
          </>
        )}
      </CommonModal>
    </Box>
  );
};

export default Users;
