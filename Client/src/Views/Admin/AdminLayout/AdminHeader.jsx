import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from '../../../Components/Header/AccountMenu';
import ThemeToggleButton from '../../../Components/Common/ThemeToggleButton';

const AdminHeader = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        borderRadius: 0, // ✅ important
        width: { sm: `calc(100% - 220px)` }, // drawerWidth = 220px
        ml: { sm: '220px' },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow:
          theme.palette.mode === 'light'
            ? '0 1px 4px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.4)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <ThemeToggleButton />
          <AccountMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
