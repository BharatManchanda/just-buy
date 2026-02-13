import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Avatar,
  Stack,
  Skeleton,
  useTheme,
  Button,
  useMediaQuery,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import apiConstants from "../../api/Constants";
import HomeIcon from '@mui/icons-material/Home';
import Orders from './Orders'
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import AddressesPage from "./Addresses";
import { useSelector } from "react-redux";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("account");
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const renderAccountDetails = () => {
    return (
      <Card>
        <CardContent>
          <Box display={'flex'} alignItems={'start'} gap={1}>
            <AccountCircleIcon/>
            <Typography variant="h6" gutterBottom>My Account Details</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography>+91 {user.user.phoneNumber}</Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      p={{ xs: 2, sm: 3, md: 4 }}
      maxWidth="md"
      mx="auto"
      border={1}
      borderColor="divider"
      borderRadius={1}
      boxShadow={1}
      bgcolor={theme.palette.mode === 'light' ? '#fff' : 'background.paper'}
    >
      <CommonBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "My "+activeTab },
        ]}
      />

      {/* Top Tabs */}
      <Stack direction="row" spacing={2} mt={3} mb={4}>
        {["account", "orders", "addresses"].map((tab) => (
          <Button
            size={isMobile ? 'small' : 'medium'}
            startIcon={tab === "orders" ? <ShoppingBagIcon/> : tab === "account" ? <AccountCircleIcon/>  : <HomeIcon/> }
            key={tab}
            variant={activeTab === tab ? "contained" : "outlined"}
            onClick={() => setActiveTab(tab)}
            color={activeTab === tab ? "primary" : "inherit"}
          >
            {tab === "account" ? "Account" : tab === "orders" ? "Orders" : "Addresses"}
          </Button>
        ))}
      </Stack>

      {activeTab === "account" && renderAccountDetails()}
      {activeTab === "orders" && (
        <Orders/>
      )}
      {activeTab === "addresses" && (
        <AddressesPage/>
      )}
    </Box>
  );
};

export default MyAccount;
