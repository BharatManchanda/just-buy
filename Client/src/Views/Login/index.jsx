import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithOtp, sendOtp } from '../../store/redux/thunks';
import { resetOtpSent } from '../../store/redux/authSlice';
import { showError } from '../../Assets/Constants/showNotifier';
import CommonModal from '../../Components/Common/CommonModal';
import ThemeButton from '../../Components/Common/ThemeButton';
import appTheme from '../../Assets/Theme';

export default function Login({ modalType, setModalType }) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");

  const handleOpen = useCallback(() => setModalType('phone'), []);
  const handleClose = useCallback(() => {
    setModalType(null);
    setPhone('');
    setOtp(["", "", "", "", "", ""]);
    setIsOtpSent(false);
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only one digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPhone(raw);
    setFormattedPhone(formatPhone(raw));
  };

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    let formatted = digits;

    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + " " + digits.slice(5);
    }

    return formatted;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      if (modalType === 'phone') {
        if (phone.length < 10) {
          showError('Enter a valid phone number');
          return;
        }

        const res = await dispatch(sendOtp({ phoneNumber: phone }));
        if (res.meta.requestStatus === 'fulfilled') {
          setModalType('otp');
          setIsOtpSent(true);
        }
      } else {
        const res = await dispatch(loginWithOtp({ phoneNumber: phone, otp:otp.join('') }));
        if (res.meta.requestStatus === 'fulfilled') {
          handleClose();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userState.isAuthenticated && userState.user) {
      handleClose();
    }
  }, [userState.isAuthenticated]);

  const handleChangeNumber = () => {
    dispatch(resetOtpSent()); // Optional if not used in slice
    setIsOtpSent(false);
    setModalType('phone');
  };

  return (
    <>
      <IconButton onClick={handleOpen} size='small'>
        <LoginIcon fontSize='large' color='primary'/>
      </IconButton>
      <CommonModal
        open={modalType === 'phone'}
        handleClose={handleClose}
        header="Login or Sign Up"
        buttonTitle="Send OTP"
        handleSubmit={handleSendOtp}
        loginModal
        loading={loading}
      >
        <Box width={isMobile ? '100%' : '400px'} px={2} py={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="phone-input">Enter Mobile Number</InputLabel>
            <OutlinedInput
              value={formattedPhone}
              onChange={handlePhoneChange}
              startAdornment={<InputAdornment position="start">+91</InputAdornment>}
              label="Enter Mobile Number"
              type="tel"
              inputMode="numeric"
              sx={{
                borderRadius: 2,
                "& input": { letterSpacing: "2px", fontSize: "18px" },
              }}
            />
          </FormControl>
        </Box>
      </CommonModal>

      <CommonModal
        open={modalType === 'otp'}
        handleClose={handleClose}
        header="OTP Verification"
        buttonTitle="Login"
        handleSubmit={handleSendOtp}
        loading={loading}
      >
        <Box width={isMobile ? '100%' : '400px'} px={2} py={1}>
          <Box display="flex" gap={1} justifyContent="center" mt={2}>
            {otp.map((digit, i) => (
              <TextField
                key={i}
                id={`otp-${i}`}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    padding: "0",
                  },
                }}
                sx={{
                  width: 45,
                  borderRadius:50,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 50,
                  },
                }}
              />
            ))}
          </Box>
          {isOtpSent && (
            <>
              <Typography variant="body2" mt={1} textAlign="center">
                OTP sent to <strong>+91 {phone}</strong>
              </Typography>
              <Typography variant="body2" mt={1} textAlign="center">
                This is for demo purposes. Use <strong>123456</strong> as OTP.
              </Typography>
            </>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="text" onClick={handleChangeNumber}>
              Change Number?
            </Button>
          </Box>
        </Box>
      </CommonModal>
    </>
  );
}
