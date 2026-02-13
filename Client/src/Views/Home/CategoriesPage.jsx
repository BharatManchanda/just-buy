import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import apiConstants from "../../api/Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import CategoryGrid from "./CategoryGrid";
import NoDataFound from "../../Components/Common/NoDataFound ";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConstants.home.getAllCategories();
        if (res.data.success) {
          setCategories(res.data.data.flat || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box px={isMobile ? 2 : 4} py={3}>
      <CommonBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Categories" },
        ]}
      />

      <Typography
        variant="h5"
        fontWeight={600}
        mb={2}
        mt={1}
        color="primary"
      >
        Shop by Category
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <NoDataFound message="No categories available at the moment." icon="📂" />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </Box>
  );
};

export default CategoriesPage;
