import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
  { day: 'Mon', orders: 120 },
  { day: 'Tue', orders: 150 },
  { day: 'Wed', orders: 180 },
  { day: 'Thu', orders: 210 },
  { day: 'Fri', orders: 300 },
  { day: 'Sat', orders: 400 },
  { day: 'Sun', orders: 280 },
];
const StatCard = ({ icon, title, value }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </Box>
      <Box color="primary.main">{icon}</Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Welcome Back, Admin 👋
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCartIcon fontSize="large" />}
            title="Today's Orders"
            value="320"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<StoreIcon fontSize="large" />}
            title="Products Listed"
            value="1240"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon fontSize="large" />}
            title="Active Users"
            value="658"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AccessTimeIcon fontSize="large" />}
            title="Avg. Delivery Time"
            value="9 min"
          />
        </Grid>
      </Grid>

      {/* Orders Chart */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Orders Over Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke={theme.palette.primary.main} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
