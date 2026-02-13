import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";

const TrendingSections = ({ data }) => {
  return (
    <Box>
      {data.map((section, index) => (
        <Box key={index} mb={4}>
          <Grid container spacing={2}>
            {section.items.map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Card sx={{ borderRadius: 2, cursor: "pointer", boxShadow: 1 }}>
                  <CardMedia
                    component="img"
                    sx={{
                      height: { xs: 140, sm: 180, md: 250 },
                      width: "100%",
                      objectFit:'fill'
                    }}
                    image={item.image}
                    alt={item.name}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default TrendingSections;
