import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
  Divider,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showError } from "../../Assets/Constants/showNotifier";
import { getHomeDetails } from "../../store/redux/homeThunk";
import { showLoading } from "../../Assets/Constants/showLoading";
import ImageSlider from "../../Components/Common/ImageSlider";
import SearchBar from "../../Components/Common/SearchBar";
import { getMe } from "../../store/redux/thunks";
import {
  addCartProductItem,
  removeCartProduct,
} from "../../store/redux/cartThunk";
import ProductSkeleton from "../../Components/Common/ProductSkeleton";
import CategorySkeleton from "../../Components/Common/CategorySkeleton";
import CategoryProduct from "./CategoryProduct";
import Product from "./Product";
import { useSearch } from "../../context/SearchContext";
import TrendingSections from "./TrendingSections";
const trendingData = [
  {
    title: "Trending Now",
    items: [
      {
        name: "Fresh Watermelon",
        desc: "Summer Special",
        image: "/images/home-just-buy.jpg",
      },
      {
        name: "Fresh Watermelon",
        desc: "Summer Special",
        image: "/images/home-just-buy-2.png",
      },
    ],
  },
  // {
  //   title: "Most Ordered",
  //   items: [
  //     {
  //       name: "Amul Butter",
  //       desc: "500g Pack",
  //       image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzM0ODN8MHwxfHNlYXJjaHwxfHxHcmFwZXN8ZW58MHwwfHx8MTc0NjI4OTY3NHww&ixlib=rb-4.0.3&q=80&w=400",
  //     },
  //   ],
  // },
];

const Home = () => {
  const dispatch = useDispatch();
  const productsss = useSelector((state) => state.home);
  const errorMsg = useSelector((state) => state.product.error);

  const {
    searchQuery,
    showSearchResult,
    searchResults,
    searchLoading,
  } = useSearch();

  const [progress, setProgress] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    let interval;
    try {
      setProgress(0);
      showLoading(true, "linear", 0);
      interval = setInterval(() => {
        setProgress((prev) => {
          const updated = prev < 90 ? prev + 5 : prev;
          showLoading(true, "linear", updated);
          return updated;
        });
      }, 200);
      await dispatch(getHomeDetails());
      if (errorMsg?.length) showError(errorMsg);
      clearInterval(interval);
      setProgress(100);
      showLoading(true, "linear", 100);
    } catch (err) {
      console.error("Error fetching home details:", err);
      showError("Something went wrong.");
    } finally {
      clearInterval(interval);
      setTimeout(() => showLoading(false, "linear", 0), 500);
    }
  };

  const handleAddItem = (product) => dispatch(addCartProductItem(product));
  const handleSubItem = (id) => dispatch(removeCartProduct(id));

  return (
    <Box position="relative" minHeight={'100vh'}>
      {isMobile && (
        <Box maxWidth="600px" mx="auto" px={2} mb={4}>
          <SearchBar />
        </Box>
      )}

      {!showSearchResult && (
        <>
          <Typography
            variant="h4"
            fontWeight="bold"
            my={2}
            color="primary"
            sx={{ letterSpacing: 0.5 }}
          >
            Just Buy – Shop Smarter, Not Slower
          </Typography>
          {progress !== 100 ? (
            <>
              <CategorySkeleton count={isMobile ? 4 : 8} />
              <Box py={4}>
                <Skeleton variant="text" width="20%" height={24} />
              </Box>
              <ProductSkeleton count={isMobile ? 4 : 6} />
            </>
          ) : (
            <>
              <ImageSlider categories={productsss.categories} />
              <Divider sx={{ my: 4 }} />

              {/* <Box
                px={2}
                py={2}
                display="flex"
                gap={2}
                overflow="auto"
                sx={{
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {["Instant Delivery", "Best Offers", "New Arrivals", "Top Rated", "Seasonal Picks"].map(
                  (label, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: theme.palette.grey[100],
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        fontSize: "14px",
                        cursor: "pointer",
                        color: theme.palette.text.primary,
                        transition: "all 0.2s ease",
                        ":hover": {
                          bgcolor: "primary.light",
                          color: "primary.main",
                        },
                      }}
                    >
                      {label}
                    </Box>
                  )
                )}
              </Box> */}
              {!isMobile && 
                <TrendingSections data={trendingData} />
              }
              <CategoryProduct
                list={productsss}
                handleAddItem={handleAddItem}
                handleSubItem={handleSubItem}
              />
            </>
          )}
        </>
      )}

      {showSearchResult && (
        <Box px={2} py={3}>
          {searchQuery.trim() && (
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Showing results for "{searchQuery}"
            </Typography>
          )}
          {searchLoading ? (
            <ProductSkeleton count={4} />
          ) : searchResults.length > 0 ? (
            <Grid container spacing={0.1}>
              {searchResults.map((product) => (
                <Product
                  key={product._id}
                  handleAddItem={handleAddItem}
                  handleSubItem={handleSubItem}
                  product={product}
                />
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {searchQuery && showSearchResult && "No products found."}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Home;
