import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/redux/thunks';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../../Assets/Constants/showNotifier';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        dispatch(logout());
        navigate('/');
      } catch (err) {
        showError(err.message || 'Logout failed');
        console.error('Logout failed:', err);
      }
    };
    performLogout();
  }, [dispatch, navigate]);

  return (
    <div>
      Logging Out...
    </div>
  );
};

export default Logout;
