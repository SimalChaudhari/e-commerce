import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import {
    TotalVendorsIcon,
    TotalProductsIcon,
    CompleteOrderIcon,
} from 'src/assets/illustrations';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { Summary } from '../summary';
import { Statistics } from '../statistics';
import { dashboardList, dashOrderList } from 'src/store/action/dashboardActions';
import { format } from 'date-fns';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export function Overview() {
    const widgetStyle = { cursor: 'pointer' };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch dashboard and orders data
    useEffect(() => {
        dispatch(dashboardList());
        dispatch(dashOrderList());
    }, [dispatch]);

    const dashboard = useSelector((state) => state.dash.dashboard);
    const _orders = useSelector((state) => state.dash.order_count);

    // Map orders data to monthly counts based on the selected year
    const generateMonthlyData = (year) => {
        const allMonths = Array.from({ length: 12 }, (_, i) =>
            format(new Date(year, i, 1), 'MMM-yyyy')
        );

        const monthLookup = _orders?.reduce((acc, item) => {
            const itemDate = new Date(item.month);
            if (itemDate.getFullYear() === year) {
                const monthKey = format(itemDate, 'MMM-yyyy');
                acc[monthKey] = item.count || 0;
            }
            return acc;
        }, {});

        return allMonths.map((month) => monthLookup?.[month] || 0);
    };

    return (
        <DashboardContent sx={{ pt: 2 }} maxWidth="2xl">
            <Grid container spacing={3} disableEqualOverflow>
                <Grid xs={12} md={4}>
                    <Summary
                        title="Total Vendors"
                        total={dashboard?.usersCount || 0}
                        style={widgetStyle}
                        onClick={() => navigate(paths.vendors.root)}
                        icon={<TotalVendorsIcon />}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <Summary
                        title="Total Products"
                        total={dashboard?.itemsCount || 0}
                        style={widgetStyle}
                        onClick={() => navigate(paths.products.root)}
                        icon={<TotalProductsIcon />}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <Summary
                        title="Total Completed Orders"
                        total={dashboard?.ordersCount || 0}
                        style={widgetStyle}
                        onClick={() => navigate(paths.orders.root)}
                        icon={<CompleteOrderIcon />}
                    />
                </Grid>

                <Grid xs={12} md={12} lg={12}>
                    <Statistics
                        title="Monthly Orders Statistics"
                        generateMonthlyData={generateMonthlyData} // Pass function to generate data
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
