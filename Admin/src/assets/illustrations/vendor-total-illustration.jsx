import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function TotalVendorsIcon({ sx, ...other }) {
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
      {/* Vendor Person Icons */}
      <circle cx="60" cy="70" r="15" fill={PRIMARY_MAIN} /> {/* Head */}
      <rect x="50" y="85" width="20" height="30" rx="5" fill={PRIMARY_MAIN} /> {/* Body */}

      <circle cx="140" cy="70" r="15" fill={PRIMARY_LIGHT} /> {/* Head */}
      <rect x="130" y="85" width="20" height="30" rx="5" fill={PRIMARY_LIGHT} /> {/* Body */}

      <circle cx="100" cy="100" r="15" fill={PRIMARY_DARK} /> {/* Head */}
      <rect x="90" y="115" width="20" height="30" rx="5" fill={PRIMARY_DARK} /> {/* Body */}

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

export default memo(TotalVendorsIcon);
