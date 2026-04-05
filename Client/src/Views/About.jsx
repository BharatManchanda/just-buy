import React from 'react';
import { Container, Typography, Box } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Box textAlign="center" mb={4}>
        <InfoIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          About BuyNow
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          Delivering essentials in 10 minutes, revolutionizing local commerce.
        </Typography>
      </Box>

      <Typography paragraph sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2, py: 1, bgcolor: 'grey.50' }}>
        Buy Now was founded on the principle that time is the most valuable commodity. In today's fast-paced world, waiting hours or even days for essentials is no longer acceptable. Inspired by the hyper-local delivery models of companies like Zepto and Blinkit, we built a network of strategically located "dark stores" and optimized our logistics chain to achieve a service goal of delivering orders within **10 minutes**.
      </Typography>

      <Box sx={{ mt: 4, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Our Mission
        </Typography>
      </Box>
      <Typography paragraph sx={{ mt: 1 }}>
        To provide the fastest, most reliable delivery service for everyday needs, simplifying life for our customers and setting a new standard for instant retail.
      </Typography>

      <Box sx={{ mt: 4, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          The 10-Minute Difference
        </Typography>
      </Box>
      <Typography paragraph sx={{ mt: 1 }}>
        Our speed is enabled by cutting-edge technology, efficient inventory management, and a dedicated team. Every aspect of our operation, from the moment you tap 'Buy' to the moment the rider reaches your door, is optimized for speed and accuracy, ensuring you get what you need, fast. 
      </Typography>

    </Container>
  );
};

export default AboutUs;
