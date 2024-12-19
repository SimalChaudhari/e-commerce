import { formatNumberLocale } from 'src/locales';

// ----------------------------------------------------------------------

const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' };

function processInput(inputValue) {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

// export function fCurrency(inputValue, options) {
//   const locale = formatNumberLocale() || DEFAULT_LOCALE;

//   const number = processInput(inputValue);
//   if (number === null) return '';

//   const fm = new Intl.NumberFormat(locale.code, {
//     style: 'currency',
//     currency: locale.currency,
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//     ...options,
//   }).format(number);

//   return fm;
// }

export function fCurrency(inputValue, options) {
  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR', // Set currency explicitly to INR
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

export function fLimitedCurrency(inputValue, options) {
  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat('en-IN', {
    style: 'decimal', // Use 'decimal' to remove the currency symbol
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}


// ----------------------------------------------------------------------

export function fPercent(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue) {
  const number = processInput(inputValue);
  if (number === null || number === 0) return '0 bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}


export function formatDateIndian(inputDate) {
  if (!inputDate) return '';

  // Convert input to a valid Date object
  const date = new Date(inputDate);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();

  // Return formatted date
  return `${day}-${month}-${year}`;
}
