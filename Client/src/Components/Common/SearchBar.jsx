import React, { useRef, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close"; // 👈 Import clear icon
import './style.scss';
import { useSearch } from "../../context/SearchContext";

const SearchBar = ({ onFocusRemove, placeholder = "Search for products or categories..." }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const wrapperRef = useRef(null);
  const placeholderList = [
    "Search for 'Chocolates'",
    "Search for 'Breads'",
    "Search for 'Chips'",
    "Search for 'Dryer'",
    "Search for 'Vegetables'",
    "Search for 'Wireless Headphones'",
    "Search in 'Home Appliances'",
    "Search in 'Sports Equipment'",
  ];

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out

      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderList.length);
        setFade(true); // Fade in new text
      }, 250); // Wait before updating placeholder
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    showSearchResult,
    setShowSearchResult,
    searchLoading,
  } = useSearch();

  const showSuggestions = searchQuery.trim().length > 0 && !searchLoading;

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResult(!!e.target.value.trim());
  };

  const handleClear = () => {
    setSearchQuery("");
    setShowSearchResult(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onFocusRemove?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFocusRemove]);

  return (
    <Box position="relative">
      <TextField
        fullWidth
        size="small"
        className="home-search-bar"
        value={searchQuery}
        onChange={handleChange}
        onFocus={() => setShowSearchResult(true)}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: isDark ? "#cbd5e1" : "#64748b" }} />
            </InputAdornment>
          ),
          endAdornment:     showSearchResult && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <CloseIcon sx={{ color: isDark ? "#cbd5e1" : "#64748b", fontSize: 20 }} />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: "999px",
            backgroundColor: isDark ? "#1e293b" : "#f8fafc",
            px: 1.5,
            '& fieldset': {
              borderColor: isDark ? "#334155" : "#d1d5db",
            },
            '&:hover fieldset': {
              borderColor: isDark ? "#475569" : "#9ca3af",
            },
          },
        }}
      />
      {searchQuery === "" && (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: "50%",
            left: 48,
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: isDark ? "#94a3b8" : "#94a3b8",
            transition: "opacity 0.3s",
            opacity: fade ? 1 : 0,
          }}
        >
          {placeholderList[currentPlaceholderIndex]}
        </Typography>
      )}
    </Box>

  );
};

export default SearchBar;
