import React from 'react';
import Avatar from '@mui/material/Avatar';

// Utility to generate a background color from a string
function stringToColor(string) {
    let hash = 0;
  
    /* eslint-disable no-bitwise */
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  

// Reusable component to generate letter avatars
export const  LetterAvatar = ({ name, size = 40, style = {} }) => {
    const getInitials = (fullName) => {
      if (!fullName || typeof fullName !== 'string') return '?';
  
      const words = fullName.trim().split(' ');
      if (words.length === 1) {
        return words[0][0].toUpperCase(); // First letter of the single word
      }
      return `${words[0][0]}${words[1][0]}`.toUpperCase(); // First letters of the first two words
    };
  
    const initials = getInitials(name);
  
    return (
      <Avatar
        sx={{
          bgcolor: stringToColor(name || 'Default'), // Use a fallback string for color generation
          width: size,
          height: size,
          fontSize: size / 2,
          ...style,
        }}
      >
        {initials}
      </Avatar>
    );
  };
  

  


