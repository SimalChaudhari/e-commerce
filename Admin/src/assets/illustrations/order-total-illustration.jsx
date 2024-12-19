

import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function TotalOrderIcon({ sx, ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_DARK = theme.vars.palette.primary.dark;
  const SUCCESS_COLOR = theme.vars.palette.success.main;

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
      {/* Multiple Shopping Bags */}
      <rect x="55" y="80" width="40" height="50" fill={PRIMARY_MAIN} />
      <line x1="55" y1="80" x2="95" y2="80" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="65" y1="80" x2="65" y2="65" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="85" y1="80" x2="85" y2="65" stroke={PRIMARY_LIGHT} strokeWidth="2" />

      <rect x="100" y="90" width="40" height="50" fill={PRIMARY_DARK} />
      <line x1="100" y1="90" x2="140" y2="90" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="110" y1="90" x2="110" y2="75" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="130" y1="90" x2="130" y2="75" stroke={PRIMARY_LIGHT} strokeWidth="2" />

      {/* Label Icon to Indicate Total */}
      <circle cx="150" cy="50" r="15" fill={SUCCESS_COLOR} />
      <text
        x="150"
        y="55"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="#fff"
      >
        Σ
      </text>

      <defs>
        <linearGradient
          id="totalGradient"
          x1="25.9"
          x2="25.9"
          y1="122.338"
          y2="192.465"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
    </Box>
  );
}

export default memo(TotalOrderIcon);
