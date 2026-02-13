import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const placeholder =
  "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80";

const CategoryGrid = ({ categories = [] }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} mt={2}>
      {categories.map((category) => (
        <Grid item xs={6} sm={4} md={3} lg={2.4} key={category.id}>
          <Card
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px) scale(1.02)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => navigate(`/category/${category._id}`)}
          >
            <Box position="relative">
              <CardMedia
                component="img"
                height="140"
                image={category.imageUrl || placeholder}
                alt={category.name}
                onError={(e) => {
                  e.target.src = placeholder;
                }}
                sx={{ objectFit: "cover" }}
              />
              {/* Gradient Overlay */}
              <Box
                position="absolute"
                bottom={0}
                width="100%"
                height="50%"
                sx={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                }}
              />
              {/* Text Overlay */}
              <Typography
                variant="subtitle1"
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  color: "#fff",
                  fontWeight: 600,
                  zIndex: 1,
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid;
