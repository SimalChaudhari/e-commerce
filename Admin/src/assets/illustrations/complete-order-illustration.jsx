import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function CompleteOrderIcon({ sx, ...other }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const SUCCESS_COLOR = theme.vars.palette.success.main;
  const PRIMARY_LIGHT = theme.vars.palette.primary.light;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 120, maxWidth: 1, flexShrink: 0, height: 'auto', ...sx }}
      {...other}
    >
      {/* Shopping Cart Icon */}
      <rect x="50" y="80" width="100" height="60" fill={PRIMARY_MAIN} rx="10" /> {/* Cart Body */}
      <line x1="60" y1="80" x2="140" y2="80" stroke={PRIMARY_LIGHT} strokeWidth="4" /> {/* Cart Top */}
      <circle cx="65" cy="150" r="10" fill={PRIMARY_LIGHT} /> {/* Left Wheel */}
      <circle cx="135" cy="150" r="10" fill={PRIMARY_LIGHT} /> {/* Right Wheel */}

      {/* Checkmark Icon for Completed Order */}
      <polyline 
        points="70,90 90,110 130,70" 
        fill="none" 
        stroke={SUCCESS_COLOR} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Order Completed Text */}
      <text
        x="100"
        y="180"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill={PRIMARY_MAIN}
      >
        Completed
      </text>
    </Box>
  );
}

export default memo(CompleteOrderIcon);
