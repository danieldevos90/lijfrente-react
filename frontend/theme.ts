// Theme Configuration - GeldGeregeld (geldgeregeld.nl)
// Centralized design system for consistent styling

export const theme = {
  // Brand Colors - From Figma Designs
  colors: {
    primary: '#00c800',        // Bright green from Figma
    primaryDark: '#1e2021',    // Dark green from Figma
    primaryLight: '#d3ffdd',   // Light green/mint from Figma
    
    secondary: '#DCE6D5',      // Light green/mint
    secondaryDark: '#570000',  // Dark red/maroon from Figma
    secondaryLight: '#d3ffdd', // Light green/mint
    
    // Neutrals - From Figma Designs
    white: '#ffffff',
    black: '#1e2021',
    gray50: '#fafafa',         // Very light gray from Figma
    gray100: '#eeeeee',       // Light gray from Figma
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#1e2021',
    
    // Semantic Colors - From Figma Designs
    success: '#00c800',        // Bright green from Figma
    warning: '#f59e0b',
    error: '#ff0000',          // Red from Figma
    info: '#06b6d4',
    
    // UI Colors - From Figma Designs
    text: '#1e2021',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    background: '#fafafa',     // Very light gray from Figma
    backgroundAlt: '#eeeeee',  // Light gray from Figma
  },
  
  // Typography
  fonts: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  // Font Sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '64px',
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
  },
  
  // Z-index
  zIndex: {
    drawer: 1000,
    overlay: 999,
    sticky: 50,
    dropdown: 100,
    modal: 1000,
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

// CSS Custom Properties Generator
export function generateCSSVariables() {
  return `
    /* Colors - From Figma Designs */
    --color-primary: ${theme.colors.primary};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-primary-light: ${theme.colors.primaryLight};
    
    --color-secondary: ${theme.colors.secondary};
    --color-secondary-dark: ${theme.colors.secondaryDark};
    --color-secondary-light: ${theme.colors.secondaryLight};
    
    --color-white: ${theme.colors.white};
    --color-black: ${theme.colors.black};
    --color-gray-50: ${theme.colors.gray50};
    --color-gray-100: ${theme.colors.gray100};
    --color-gray-200: ${theme.colors.gray200};
    --color-gray-300: ${theme.colors.gray300};
    --color-gray-400: ${theme.colors.gray400};
    --color-gray-500: ${theme.colors.gray500};
    --color-gray-600: ${theme.colors.gray600};
    --color-gray-700: ${theme.colors.gray700};
    --color-gray-800: ${theme.colors.gray800};
    --color-gray-900: ${theme.colors.gray900};
    
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
    --color-info: ${theme.colors.info};
    
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
    --color-border: ${theme.colors.border};
    --color-bg: ${theme.colors.background};
    --color-bg-alt: ${theme.colors.backgroundAlt};
    
    /* Spacing */
    --space-xs: ${theme.spacing.xs};
    --space-sm: ${theme.spacing.sm};
    --space-md: ${theme.spacing.md};
    --space-lg: ${theme.spacing.lg};
    --space-xl: ${theme.spacing.xl};
    --space-2xl: ${theme.spacing['2xl']};
    --space-3xl: ${theme.spacing['3xl']};
    
    /* Border Radius */
    --radius-sm: ${theme.radius.sm};
    --radius-md: ${theme.radius.md};
    --radius-lg: ${theme.radius.lg};
    --radius-xl: ${theme.radius.xl};
    --radius-full: ${theme.radius.full};
    
    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-base: ${theme.shadows.base};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
    --shadow-2xl: ${theme.shadows['2xl']};
    
    /* Fonts */
    --font-base: ${theme.fonts.base};
    --font-heading: ${theme.fonts.heading};
  `;
}

export default theme;

