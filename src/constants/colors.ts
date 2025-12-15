// Color constants for the application, following a professional medical/dental theme.
export const Colors = {
  // Primary (Medical Blue - Trust, Hygiene, Professionalism)
  primary: '#0288D1', // Deep Sky Blue - Standard medical color
  primaryDark: '#01579B', // Darker blue for headers/footers
  primaryLight: '#E1F5FE', // Very light blue for backgrounds

  // Secondary (Mint Green - Freshness, Health)
  secondary: '#26A69A', // Teal/Mint green
  secondaryLight: '#E0F2F1', // Light mint for cards/accents

  // Accent (Clean White & Soft Gray)
  accent: '#FF9800', // Orange for Call-to-Actions (Book Now, Emergency)

  // Status colors
  success: '#43A047', // Green
  error: '#D32F2F',   // Red
  warning: '#FFA000', // Amber
  info: '#1976D2',    // Blue

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F5F5F5',
  mediumGray: '#BDBDBD',
  darkGray: '#212121',

  // Light theme (Clinical, Clean, Bright)
  light: {
    background: '#F5F7FA', // Very subtle cool gray/blue tint
    card: '#FFFFFF',       // Pure white
    text: '#263238',       // Dark Blue-Gray (softer than black)
    border: '#CFD8DC',     // Blue-gray border
    primary: '#0288D1',
    muted: '#78909C',      // Muted blue-gray
  },

  // Dark theme (Modern, Professional, Easy on eyes)
  dark: {
    background: '#102027', // Very dark blue-gray (not pitch black)
    card: '#263238',       // Dark blue-gray card
    text: '#ECEFF1',       // Light blue-gray text
    border: '#37474F',
    primary: '#29B6F6',    // Lighter blue for dark mode visibility
    muted: '#B0BEC5',
  },

  // Dental specific
  dental: {
    tooth: '#FAFAFA',
    gum: '#F48FB1',
    cavity: '#8D6E63',
  }
};

export const COLORS = {
  ...Colors,
  ...Colors.light,
  gray: Colors.mediumGray,
  grayLight: Colors.lightGray,
};
