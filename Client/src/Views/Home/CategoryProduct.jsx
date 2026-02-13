import { Grid, Typography, Box } from '@mui/material';
import React from 'react';
import Product from './Product';
import { Link } from 'react-router-dom';

const CategoryProduct = ({ list, handleAddItem, handleSubItem }) => {
  return (
    <Box>
      {list.categoryWithProduct?.map((item, idx) =>
        item.products?.length > 0 ? (
          <Box key={idx} my={4}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems="center">
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  color: "primary.main",
                  textTransform: "capitalize",
                  letterSpacing: "0.5px",
                  position: "relative",
                  display: "inline-block",
                  fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                  '&::after': {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -6,
                    width: "50%",
                    height: "4px",
                    backgroundColor: "primary.main",
                    borderRadius: 2,
                  },
                }}
              >
                {item.name}
              </Typography>

              <Link to={`/category/${item._id}`} style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
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
                  See all
                </Typography>
              </Link>
            </Box>
            <Grid container spacing={1} rowGap={1}>
              {item.products.map((product) => (
                <Product
                  key={product._id}
                  product={product}
                  handleAddItem={handleAddItem}
                  handleSubItem={handleSubItem}
                />
              ))}
            </Grid>
          </Box>
        ) : null
      )}
    </Box>
  );
};

export default CategoryProduct;
