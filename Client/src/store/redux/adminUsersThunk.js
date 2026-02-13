// adminUsersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiConstants from '../../api/Constants';
import {
  getListFailed,
  getListSuccess,
  gettingList,
  userCreated,
  userUpdated,
  userDeleted
} from './adminUsersSlice';
import { showError } from '../../Assets/Constants/showNotifier';

export const getUsersList = createAsyncThunk(
  'adminUsers/getUsersList',
  async (_, { dispatch }) => {
    try {
      dispatch(gettingList());
      const response = await apiConstants.admin.users.get();
      const list = response.data.data;
      if (response.data.success) {
        dispatch(getListSuccess(list));
      }
      return list;
    } catch (err) {
        const message = err?.message || err?.response?.data?.message || 'Something went wrong';
        showError(message);    
    }
  }
);

export const createUser = createAsyncThunk(
  'adminUsers/createUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiConstants.admin.users.create(data);
      return response.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Something went wrong';
      showError(message);
      return rejectWithValue(message); 
    }
  }
);

export const updateUser = createAsyncThunk(
  'adminUsers/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiConstants.admin.users.update(id, data);
      return response.data;
    } catch (err) {
        const message = err?.message || err?.response?.data?.message || 'Something went wrong';
        showError(message);    
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiConstants.admin.users.delete(id);
      return response.data;
    } catch (err) {
        const message = err?.response?.data?.message || 'Something went wrong';
        showError(message);    
    }
  }
);
