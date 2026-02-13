// NotFound.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      sx={{
        backgroundColor: 'background.default',
        color: 'text.primary',
        px: 2,
      }}
    >
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, mb: 2, color: 'primary.main' }} />
      <Typography variant="h3" fontWeight={600} gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ px: 4, py: 1 }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;
