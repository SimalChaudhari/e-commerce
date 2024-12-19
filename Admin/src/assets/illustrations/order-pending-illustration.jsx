import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function PendingOrderIcon({ sx, ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_DARK = theme.vars.palette.primary.dark;
  const PRIMARY_DARKER = theme.vars.palette.primary.darker;

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
      {/* Person Icon */}
      <circle cx="100" cy="60" r="10" fill={PRIMARY_MAIN} />
      <path
        d="M95 70c5 0 10 0 10 20s-10 10-10 10h-2c0 0-10 0-10-10s5-20 10-20z"
        fill={PRIMARY_LIGHT}
      />
      {/* Clock Icon to Represent Waiting */}
      <circle cx="150" cy="150" r="20" fill={PRIMARY_DARK} />
      <path
        d="M150 140v10h10"
        stroke={PRIMARY_LIGHT}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Chair for Person Sitting */}
      <rect x="85" y="90" width="30" height="10" fill={PRIMARY_DARKER} />
      <rect x="85" y="100" width="5" height="20" fill={PRIMARY_DARKER} />
      <rect x="110" y="100" width="5" height="20" fill={PRIMARY_DARKER} />

      <defs>
        <linearGradient
          id="a"
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

export default memo(PendingOrderIcon);
