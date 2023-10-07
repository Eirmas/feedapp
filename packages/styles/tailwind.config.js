module.exports = {
  darkMode: 'class',
  safelist: [],
  theme: {
    borderRadius: {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      full: '9999px',
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
    fontSize: {
      h1: [
        '3rem',
        {
          fontWeight: '700',
          lineHeight: 'calc(3.5 / 3)',
          letterSpacing: '0.0125rem',
        },
      ],
      h2: [
        '2rem',
        {
          fontWeight: '700',
          lineHeight: '1.25',
          letterSpacing: '0.0125rem',
        },
      ],
      h3: [
        '1.5rem',
        {
          fontWeight: '700',
          lineHeight: 'calc(4 / 3)',
          letterSpacing: '0.0125rem',
        },
      ],
      h4: [
        '1.5rem',
        {
          fontWeight: '600',
          lineHeight: 'calc(4 / 3)',
          letterSpacing: '0.0125rem',
        },
      ],
      'body-large-bold': [
        '1.25rem',
        {
          fontWeight: '600',
          lineHeight: '1.2',
          letterSpacing: '0.0125rem',
        },
      ],
      'body-large': [
        '1.25rem',
        {
          fontWeight: '400',
          lineHeight: '1.2',
          letterSpacing: '0',
        },
      ],
      'body-bold': [
        '1rem',
        {
          fontWeight: '600',
          lineHeight: '1.5',
          letterSpacing: '0.00625rem',
        },
      ],
      body: [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0',
        },
      ],
      'body-small-bold': [
        '0.875rem',
        {
          fontWeight: '600',
          lineHeight: 'calc(10 / 7)',
          letterSpacing: '0.00625rem',
        },
      ],
      'body-small': [
        '0.875rem',
        {
          fontWeight: '400',
          lineHeight: 'calc(10 / 7)',
          letterSpacing: '0',
        },
      ],
      button: [
        '1rem',
        {
          fontWeight: '500',
          lineHeight: '1.5',
          letterSpacing: '0.0125rem',
        },
      ],
      'button-small': [
        '0.875rem',
        {
          fontWeight: '500',
          lineHeight: 'calc(12 / 7)',
          letterSpacing: '0.0125rem',
        },
      ],
      caption: [
        '0.75rem',
        {
          fontWeight: '400',
          lineHeight: 'calc(4 / 3)',
          letterSpacing: '0',
        },
      ],
    },
    colors: {
      transparent: 'transparent',
      primary: {
        lighter: 'rgb(229 223 236 / <alpha-value>)',
        light: 'rgb(123 66 189 / <alpha-value>)',
        DEFAULT: 'rgb(73 39 112 / <alpha-value>)',
        dark: 'rgb(37 20 57 / <alpha-value>)',
      },
      secondary: {
        lighter: 'rgb(251 234 238 / <alpha-value>)',
        light: 'rgb(212 43 83 / <alpha-value>)',
        DEFAULT: 'rgb(147 31 60 / <alpha-value>)',
        dark: 'rgb(63 13 26 / <alpha-value>)',
      },
      neutral: {
        white: 'rgb(255 255 255 / <alpha-value>)',
        background: 'rgb(241 242 243 / <alpha-value>)',
        light: 'rgb(214 216 219 / <alpha-value>)',
        medium: 'rgb(159 162 174 / <alpha-value>)',
        dark: 'rgb(32 33 36 / <alpha-value>)',
      },
      semantic: {
        success: {
          light: 'rgb(217 242 217 / <alpha-value>)',
          dark: 'rgb(31 122 80 / <alpha-value>)',
        },
        info: {
          light: 'rgb(204 227 255 / <alpha-value>)',
          dark: 'rgb(0 103 230 / <alpha-value>)',
        },
        warning: {
          light: 'rgb(255 241 179 / <alpha-value>)',
          dark: 'rgb(196 71 33 / <alpha-value>)',
        },
        error: {
          light: 'rgb(255 204 204 / <alpha-value>)',
          dark: 'rgb(179 0 45 / <alpha-value>)',
        },
        focus: 'rgb(0 146 230 / <alpha-value>)',
        link: 'rgb(98 26 255 / <alpha-value>)',
      },
    },
    extends: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
