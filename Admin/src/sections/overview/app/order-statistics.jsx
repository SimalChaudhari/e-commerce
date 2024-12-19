import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';
import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function OrderStatistics({ title, chart, ...other }) {
  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,  // Total Orders
    theme.palette.success.main,  // Completed Orders
    theme.palette.error.light,   // Canceled Orders
    theme.palette.warning.main,  // Pending Orders (New color)
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: { categories: chart.categories },
    tooltip: { y: { formatter: (value) => `${value}` } },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} sx={{ mb: 3 }} />

      <ChartLegends
        colors={chartOptions.colors}
        labels={['Total Orders']}
        values={[
          fShortenNumber(chart.series[0].data?.reduce((a, b) => a + b, 0))
        ]}
        sx={{ px: 3, gap: 3 }}
      />

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


