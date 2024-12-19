import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWidgetSummary } from '../app-widget-summary';
import { useEffect } from 'react';
import { dashboardList, dashOrderList } from 'src/store/action/dashboardActions';
import { useDispatch, useSelector } from 'react-redux';
import { OrderStatistics } from '../order-statistics';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export function OverviewAppView() {

  const widgetStyle = {
    cursor: 'pointer', // Add pointer cursor
  };

  const theme = useTheme();

  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dash.dashboard);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(dashboardList());
    };
    fetchData();
  }, []);

  const _orders = useSelector((state) => state.dash.order_count);
  console.log("🚀 ~ OverviewAppView ~ _orders:", _orders);

  useEffect(() => {
    const fetchDashData = async () => {
      await dispatch(dashOrderList());
    };
    fetchDashData();
  }, []);


  // Get the current year from the system
  const currentYear = new Date().getFullYear();

  // Generate months dynamically using the current year
  const allMonths = Array.from({ length: 12 }, (_, i) =>
    format(new Date(currentYear, i, 1), 'MMM-yyyy')
  );

  const monthlyData = _orders || [];
  const monthLookup = Object.fromEntries(
    monthlyData.map((item) => [
      format(new Date(item.month), 'MMM-yyyy'),
      item,
    ])
  );

  const totalOrders = allMonths.map((month) => monthLookup[month]?.count || 0);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Vendors"
            percent={2.6}
            total={dashboard.usersCount}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.vendors.root)} // Navigate to products route
            chart={{
              categories: allMonths.slice(0, 8), // First 8 months for demo
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Products"
            percent={0.2}
            total={dashboard.itemsCount}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.products.root)} // Navigate to products route
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: allMonths.slice(0, 8),
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Completed Orders"
            percent={-0.1}
            total={dashboard.ordersCount}
            style={widgetStyle} // Apply style here
            onClick={() => navigate(paths.orders.root)} // Navigate to products route
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: allMonths.slice(0, 8),
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <OrderStatistics
            title="Monthly Orders Statistics"
            chart={{
              series: [
                { name: 'Total Orders', data: totalOrders },
              ],
              categories: allMonths,
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
