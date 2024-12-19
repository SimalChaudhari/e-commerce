import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { fShortenNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export function BookingStatistics({ title, chart, selectedYear, onYearChange, ...other }) {
  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.error.light,
    theme.palette.warning.main,
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: { categories: chart.categories },
    tooltip: { y: { formatter: (value) => `${value}` } },
  });

  return (
    <Card {...other}>
      <CardHeader title={`${title} for ${selectedYear}`} sx={{ mb: 3 }} />

      {/* Year Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, mb: 2 }}>
        <ChartLegends
          colors={chartOptions.colors}
          labels={['Orders', 'Completed Orders', 'Canceled Orders', 'Pending Orders']}
          values={[
            fShortenNumber(chart.series[0].data?.reduce((a, b) => a + b, 0)),
            fShortenNumber(chart.series[1].data?.reduce((a, b) => a + b, 0)),
            fShortenNumber(chart.series[2].data?.reduce((a, b) => a + b, 0)),
            fShortenNumber(chart.series[3].data?.reduce((a, b) => a + b, 0)),
          ]}
          sx={{ px: 3, gap: 3 }}
        />

        <DatePicker
          views={['year']}
          label="Select Year"
          value={dayjs().year(selectedYear)}
          onChange={(newValue) => onYearChange(newValue ? newValue.year() : dayjs().year())}
          maxDate={dayjs()} // Restricts selection to the current year
          renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
        />
      </Box>

      {/* Chart */}
      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={400}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
