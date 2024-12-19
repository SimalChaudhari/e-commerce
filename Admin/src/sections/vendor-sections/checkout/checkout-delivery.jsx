import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function CheckoutDelivery({ options, onApplyShipping, ...other }) {
  const { control } = useFormContext();

  return (
    <Card {...other}>
      <CardHeader title="Delivery" />

      <Controller
        name="delivery"
        control={control}
        render={({ field }) => (
          <>
            {!field.value && (
              <Typography variant="body2" color="error" sx={{ px: 3, pt: 1 }}>
                Please select a delivery option to proceed with your order.
              </Typography>
            )}
            <Box
              columnGap={2}
              rowGap={2.5}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              sx={{ p: 3 }}
            >
              {options.map((option) => (
                <OptionItem
                  key={option.id}
                  option={option}
                  selected={field.value === option.id}
                  onClick={() => {
                    field.onChange(option.id); // Use id for selection
                    onApplyShipping(option.value);
                    console.log(`Selected option: ${option.label}`);
                  }}
                />
              ))}
            </Box>

          </>
        )}
      />
    </Card>
  );
}

function OptionItem({ option, selected, ...other }) {
  const { value, label, description } = option;

  return (
    <Paper
      variant="outlined"
      key={option.id}
      sx={{
        p: 2.5,
        cursor: 'pointer',
        border: selected ? '2px solid black' : '1px solid grey',
        backgroundColor: selected ? '#e3f2fd' : 'transparent', // Light background for selected address
        display: 'flex',
        boxShadow: selected ? (theme) => theme.customShadows.card : undefined,
        transition: 'box-shadow 0.2s',
      }}
      {...other}
    >
      {label === 'Transportation' && <Iconify icon="carbon:delivery" width={40} />}
      {label === 'Self Pickup' && <Iconify icon="carbon:user" width={40} />}


      <ListItemText
        sx={{ ml: 2 }}
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {label}
            </Box>
            <Box component="span" sx={{ typography: 'h6' }}>{fCurrency(value)}</Box>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
        secondaryTypographyProps={{ typography: 'body2' }}
      />
    </Paper>
  );
}
