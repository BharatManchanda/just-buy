import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const placeholder =
  "https://images.unsplash.com/photo-1537640538966-79f369143f8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzM0ODN8MHwxfHNlYXJjaHwxfHxHcmFwZXN8ZW58MHwwfHx8MTc0NjI4OTY3NHww&ixlib=rb-4.0.3&q=80&w=400";

const CategorySlider = ({ categories }) => {
  const scrollRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [isScrolledLeft, setIsScrolledLeft] = useState(true);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  const handleScroll = () => {
    const scroll = scrollRef.current;
    setIsScrolledLeft(scroll.scrollLeft === 0);
    setIsScrolledRight(scroll.scrollLeft + scroll.offsetWidth >= scroll.scrollWidth - 5);
  };

  const scroll = (dir) => {
    const scroll = scrollRef.current;
    const scrollAmount = isMobile ? 120 : 200;
    scroll.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <Box position="relative" sx={{py: 1 }}>
      {/* Scroll Buttons */}
      {!isScrolledLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 5,
            top: "40%",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <ChevronLeft />
        </IconButton>
      )}
      {!isScrolledRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 5,
            top: "40%",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <ChevronRight />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        display="flex"
        gap={2}
        overflow="auto"
        whiteSpace="nowrap"
        sx={{
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {categories.map((category, i) => (
          <Box display={'flex'} flexDirection={'column'}>
            <Box key={i} 
              textAlign="center"
              minWidth={120} 
              sx={{borderRadius:1,
              my:1,
              "&:hover": {
                boxShadow: theme.shadows[1],
              },
              bgcolor:'#68766e0f',
              cursor:'pointer',
              }}
              onClick={() => navigate(`/category/${category.id}`)}
            >
              {console.log(category.imageUrl,"::category.imageUrl")}
              <Box
                component="img"
                src={`${process.env.REACT_APP_URL}${category.imageUrl}`}
                // onError={(e) => (e.target.src = placeholder)}
                alt={category.name}
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: "10%",
                  objectFit: "cover",
                  my: 1,
                  boxShadow: 1,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>
            <Box sx={{ maxWidth: 100, textAlign:'center', wordWrap: 'break-word', whiteSpace: 'normal' }}>
              <Typography fontSize="14px" color="text.primary">
                {category.name}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySlider;
