import {
  hiIN as hiINCore,
} from '@mui/material/locale';

// date pickers (MUI)
import {
  enUS as enUSDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'in',
    label: 'Hindi', // or you can use 'English' if you're targeting English-speaking users in India
    countryCode: 'IN',
    adapterLocale: 'hi', // for Hindi, or 'en' for English
    numberFormat: { code: 'hi-IN', currency: 'INR' }, // or 'en-IN' if using English
    systemValue: {
      components: { ...hiINCore.components },
    },
  },
];
