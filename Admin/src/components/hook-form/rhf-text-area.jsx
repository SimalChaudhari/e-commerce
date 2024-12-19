import { Controller, useFormContext } from 'react-hook-form';
import * as React from 'react';
import { styled } from '@mui/system';

// Styled Textarea Component
const Textarea = styled('textarea')(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%; /* Make it responsive */
  height: 100px; /* Set a fixed height */
  resize: none; /* Disable resizing */
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? '#DAE2ED' : '#434D5B'};
  background: ${theme.palette.mode === 'dark' ? '#303740' : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#6B7A90' : '#DAE2ED'};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? '#1C2025' : '#F3F6F9'};

  &:hover {
    border-color: #434D5B; /* blue[400] */
  }

  // Firefox
  &:focus-visible {
    outline: 0;
  }
`
);

// React Hook Form Text Area Component
export function RHFTextArea({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea
          {...field}
          style={{ width: '100%' }} // Ensure the textarea takes full width
          value={field.value}
          onChange={field.onChange}
          placeholder={helperText}
          error={!!error}
          {...other}
        />
      )}
    />
  );
}
