import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircleOutline color="success" sx={{ fontSize: 90 }} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="h4" mt={2} gutterBottom>
            Thank You for Your Order!
          </Typography>
          <Typography variant="body1" mb={4}>
            We've received your payment and your order is being processed.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/")}
            sx={{ px: 4, py: 1.5, borderRadius: 3 }}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
