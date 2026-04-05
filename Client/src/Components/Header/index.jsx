import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
  Typography,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccountMenu from './AccountMenu';
import Cart from './Cart';
import StickyCartBar from './StickyCartBar';
import Login from '../../Views/Login';
import icons from '../../Assets/Icons/Icons';
import SearchBar from '../Common/SearchBar';
import AddressModal from '../../Views/Address';

const userPages = [
  { link: '/', title: 'Home' },
];

const adminPages = [
  { link: '/admin/dashboard', title: 'Dashboard' },
  { link: '/admin/products', title: 'Products' },
  { link: '/admin/orders', title: 'Orders' },
  { link: '/admin/users', title: 'Users' },
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);

  const user = authState.user || userState.user;
  const isAdmin = user?.userRole === 'admin';
  const pages = isAdmin ? adminPages : userPages;
  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          backgroundColor: theme.palette.background.paper,
          borderRadius:0,
          boxShadow: theme.palette.mode === 'light'
            ? '0 2px 4px rgba(0,0,0,0.05)'
            : '0 1px 4px rgba(0,0,0,0.6)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, p:'0px !important' }}>
          <Box display="flex" alignItems="center">
              <>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems:'center' }}>
                  <img src="/Logo/logo.svg" alt="" srcset="" />
                  <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {icons.BuyNow}
                  </Typography>
                </Link>
              </>
          </Box>
          {isMobile &&
          <Box display={'flex'} justifyContent={'center'} width={"100%"} gap={2}>
            <AddressModal user={user}/>
          </Box>
          }
          {!isMobile  && 
          <Box display={'flex'} justifyContent={'center'} width={"100%"} gap={2} alignItems={'center'}>
              <AddressModal user={user}/>
            <Box width={'60%'}>
              <SearchBar/>
            </Box>
          </Box>
          }
          {/* Action Buttons */}
          <Box display="flex" alignItems="center" gap={'4px'}>
            
            {!isAdmin && (
              isMobile ? (
                <StickyCartBar onOpenCart={() => setCartOpen(true)} setModalType={setModalType} open={cartOpen} />
              ) : (
                <IconButton onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={cartCount} color="success">
                    <ShoppingCartOutlinedIcon color="primary" />
                  </Badge>
                </IconButton>
              )
            )}
            {!user && (
              <Login modalType={modalType} setModalType={setModalType} />
            )}
            {/* <ThemeToggleButton /> */}
            {user && <AccountMenu />}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          {pages.map((page) => (
            <ListItem
              button
              key={page.title}
              component={Link}
              to={page.link}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={page.title} />
            </ListItem>
          ))}
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      {!isAdmin && cartOpen && (
        <Cart
          open={cartOpen}
          setOpen={setCartOpen}
          modalType={modalType}
          setModalType={setModalType}
        />
      )}
    </>
  );
};

export default Header;
