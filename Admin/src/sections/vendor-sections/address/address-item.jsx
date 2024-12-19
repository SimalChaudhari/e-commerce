
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


// ----------------------------------------------------------------------

export function AddressItem({ address, action, sx, ...other }) {
  return (
    <Paper
      sx={{
        gap: 2,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>Address:</strong> {address.street_address}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>State:</strong> {address.state}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>Mobile:</strong> {address.mobile || "Not Available"}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <strong>Country:</strong> {address.country}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
