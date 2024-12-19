import { memo } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function TotalProductsIcon({ sx, ...other }) {
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
      {/* Warehouse Shelf */}
      <line x1="40" y1="150" x2="160" y2="150" stroke={PRIMARY_DARK} strokeWidth="4" />
      <line x1="40" y1="120" x2="160" y2="120" stroke={PRIMARY_DARK} strokeWidth="4" />
      
      {/* Stacked Product Boxes */}
      <rect x="50" y="90" width="30" height="30" fill={PRIMARY_MAIN} /> {/* Box 1 */}
      <rect x="90" y="90" width="30" height="30" fill={PRIMARY_LIGHT} /> {/* Box 2 */}
      <rect x="130" y="90" width="30" height="30" fill={PRIMARY_DARK} /> {/* Box 3 */}
      
      <rect x="50" y="130" width="30" height="30" fill={PRIMARY_LIGHT} /> {/* Box 4 */}
      <rect x="90" y="130" width="30" height="30" fill={PRIMARY_MAIN} /> {/* Box 5 */}
      <rect x="130" y="130" width="30" height="30" fill={PRIMARY_DARK} /> {/* Box 6 */}

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

export default memo(TotalProductsIcon);
