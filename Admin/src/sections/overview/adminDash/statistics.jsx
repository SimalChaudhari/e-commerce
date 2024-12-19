import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { TextField, Box, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { fShortenNumber } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export function Statistics({ title, generateMonthlyData, ...other }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:400px)'); // Custom breakpoint at 460px
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const chartColors = [
    theme.palette.primary.main,  // Total Orders
    theme.palette.success.main,  // Completed Orders
    theme.palette.error.light,   // Canceled Orders
    theme.palette.warning.main,  // Pending Orders
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: { categories: Array.from({ length: 12 }, (_, i) => format(new Date(selectedYear, i, 1), 'MMM-yyyy')) },
    tooltip: { y: { formatter: (value) => `${value}` } },
  });

  const totalOrders = generateMonthlyData(selectedYear);
  const totalOrdersCount = fShortenNumber(totalOrders.reduce((a, b) => a + b, 0));

  return (
    <Card {...other}>
      <CardHeader title={`${title} for ${selectedYear}`} sx={{ mb: 2 }} />

      {/* Total Orders and Year Selector in Responsive Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmallScreen ? 'start' : 'center',
          px: 3,
          mb: 2,
          gap: isSmallScreen ? 1 : 0,  // Add gap on small screens
        }}
      >
        <ChartLegends
          colors={chartOptions.colors}
          labels={['Total Orders']}
          values={[totalOrdersCount]}
          sx={{
            px: 1,
            gap: 2,
            mb: isSmallScreen && 2,
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: 'center',
            textAlign: isSmallScreen ? 'center' : 'left',
          }}
        />

        <DatePicker
          views={['year']}
          label="Select Year"
          value={dayjs().year(selectedYear)}
          onChange={(newValue) => setSelectedYear(newValue ? newValue.year() : dayjs().year())}
          maxDate={dayjs()} // Restricts selection to the current year
          renderInput={(params) => <TextField {...params} sx={{ minWidth: isSmallScreen ? '100%' : 150 }} />}
        />
      </Box>

      {/* Chart */}
      <Chart
        type="bar"
        series={[{ name: 'Total Orders', data: totalOrders }]}
        options={{
          ...chartOptions,
          xaxis: { categories: chartOptions.xaxis.categories },
        }}
        height={isSmallScreen ? 300 : 400}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
