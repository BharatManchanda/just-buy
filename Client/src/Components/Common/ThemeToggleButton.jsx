import React, { useContext } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import { ColorModeContext } from "../../App"; // update path as needed
import { useTheme } from "@mui/material/styles";
import DarkModeIcon from '@mui/icons-material/DarkMode';
const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
      <Box
        sx={{
          borderRadius: '50%',
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f1f5f9"
              : theme.palette.background.default,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? "#e2e8f0"
                : theme.palette.background.paper,
          },
        }}
      >
        <IconButton onClick={toggleColorMode} sx={{ color: theme.palette.text.primary }}>
          {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default ThemeToggleButton;
