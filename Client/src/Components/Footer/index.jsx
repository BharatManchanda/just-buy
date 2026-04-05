import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import Constant from "./Constant";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const [usefulLinks] = Constant;
  const categories = useSelector((state) => state.home.categories);
  const renderLink = (link, name, fontWeight) => {
    return(
      <Link to={link} style={{ textDecoration: 'none' }}>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: fontWeight,
            borderBottom: '2px solid transparent',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
            },
          }}
        >
          {name}
        </Typography>
      </Link>
    )
  }
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, sm: 6 },
        backgroundColor:
          theme.palette.mode === "light" ? "#f9fafb" : theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderTop: "1px solid",
        borderColor:
          theme.palette.mode === "light" ? "#e5e7eb" : "rgba(255,255,255,0.1)",
      }}
    >
      <Grid container spacing={4}>
        {/* Useful Links */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Useful Links
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {usefulLinks.map((link, idx) => (
              renderLink(`/${link.toLocaleLowerCase()}`, link, 300)
            ))}
          </Box>
        </Grid>

        {/* Categories */}
        <Grid item xs={12} sm={6} md={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={700}>
              Categories
            </Typography>
            {renderLink("/categories", "See all", 500)}
          </Box>
          <Grid container spacing={1}>
            {categories?.slice(0, 12).map((item, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                {renderLink(`category/${item.id}`, item.name, 300)}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="center" fontSize={13} color="text.secondary">
        © {new Date().getFullYear()} BuyNow. All rights reserved.
      </Box>
    </Box>
  );
};

export default Footer;
