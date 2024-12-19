

import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function SuccessOrderIcon({ sx, ...other }) {
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
      {/* Person Icon with Raised Arms */}
      <circle cx="100" cy="60" r="10" fill={SUCCESS_COLOR} />
      <path
        d="M90 75c10 0 20 0 20 15s-10 15-10 15h-5c0 0-10 0-10-15s5-15 5-15z"
        fill={PRIMARY_LIGHT}
      />
      
      {/* Tick Mark for Success */}
      <path
        d="M150 150l10 10 20-30"
        stroke={SUCCESS_COLOR}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shopping Bag Element */}
      <rect x="85" y="90" width="30" height="35" fill={PRIMARY_MAIN} />
      <line x1="85" y1="90" x2="115" y2="90" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="95" y1="90" x2="95" y2="75" stroke={PRIMARY_LIGHT} strokeWidth="2" />
      <line x1="105" y1="90" x2="105" y2="75" stroke={PRIMARY_LIGHT} strokeWidth="2" />

      <defs>
        <linearGradient
          id="successGradient"
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

export default memo(SuccessOrderIcon);
