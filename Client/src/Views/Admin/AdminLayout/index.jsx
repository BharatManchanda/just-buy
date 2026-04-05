// AdminLayout.js
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, Outlet, useLocation } from 'react-router-dom';
import icons from '../../../Assets/Icons/Icons';
import AdminHeader from './AdminHeader';

const drawerWidth = 220;

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { name: 'Dashboard', route: '/admin/dashboard', icon: <DashboardIcon />, relatedRoute: [] },
    { name: 'Users', route: '/admin/users', icon: <DashboardIcon />, relatedRoute: [] },
    { name: 'Categories', route: '/admin/categories', icon: <InventoryIcon />, relatedRoute: ['/products'] },
    { name: 'Logout', route: '/admin/logout', icon: <ExitToAppIcon />, relatedRoute: [] },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        borderRadius: 0, 
        height: '100%',
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 2,
      }}
    >
      <Box sx={{ px: 2, pb: 1 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
          <img src="/Logo/logo.svg" alt="" srcset="" />
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
            {icons.BuyNow}
          </Typography>
        </Link>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 1, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.route ||
            item.relatedRoute.some((r) => location.pathname.startsWith(r));

          return (
            <ListItem
              key={item.name}
              component={Link}
              to={item.route}
              button
              sx={{
                borderRadius: 2,
                my: 1,
                px: 2,
                py: 1.2,
                backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
                transition: 'all 0.25s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36, mr: 1 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={500} fontSize={14}>{item.name}</Typography>}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ textAlign: 'center', py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Admin Panel © 2025
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', borderRadius:0 }}>
      <CssBaseline />

      {/* Header */}
      <AdminHeader onMenuClick={handleDrawerToggle} />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            borderRadius: 0, 
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRadius: 0, 
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        {isMobile && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
}
