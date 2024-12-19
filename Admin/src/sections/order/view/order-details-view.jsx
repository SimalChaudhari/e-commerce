import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from './table/order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';
import { useFetchOrderData } from '../components/fetch-order';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { _orders } from 'src/_mock/_order';

// ----------------------------------------------------------------------

export function OrderDetailsView() {


  const { fetchByIdData } = useFetchOrderData()
  const { id } = useParams(); // Get the vendor ID from URL
  const order = useSelector((state) => state.order?.orderByID || []);
  const [status, setStatus] = useState(order?.status);
  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  useEffect(() => {
    fetchByIdData(id)
  }, [])


  const timeline = [
    { title: 'Delivery successful', time: order?.createdAt },
    { title: 'Transporting to [2]', time: order?.createdAt },
    { title: 'Transporting to [1]', time: order?.createdAt },
    { title: 'Order has been created', time: order?.createdAt },
  ]


  return (
    <DashboardContent maxWidth="2xl">
      <OrderDetailsToolbar
        backLink={paths?.orders.root}
        orderNumber={order?.orderNo}
        createdAt={order?.createdAt}
        status={order?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order?.orderItems}
              shipping={order?.address}
              subtotal={order?.totalPrice}
              totalAmount={order?.totalPrice}
              discount={order?.discount}
              finalAmount={order?.finalAmount}

            />

            <OrderDetailsHistory orderDate={order?.createdAt} history={timeline} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            delivery={order}
            customer={order?.user}
            shippingAddress={order?.address}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
