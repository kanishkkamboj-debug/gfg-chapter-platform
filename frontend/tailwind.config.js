export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D1A',
        'background-base': '#0D0D1A',
        surface: 'rgba(255, 255, 255, 0.05)',
        'surface-dim': '#10150f',
        'surface-bright': '#353b34',
        'surface-container-lowest': '#0a0f0a',
        'surface-container-low': '#181d17',
        'surface-container': '#1c211b',
        'surface-container-high': '#262b25',
        'surface-container-highest': '#313630',
        'surface-variant': '#313630',
        'on-surface': '#dfe4db',
        'on-surface-variant': '#becabb',
        'inverse-surface': '#dfe4db',
        'inverse-on-surface': '#2c322c',

        primary: '#2F8D46',
        'primary-bright': '#7ddb8a',
        'primary-container': '#46a359',
        'on-primary': '#003913',
        'on-primary-container': '#003210',
        'inverse-primary': '#006e2c',

        secondary: '#1A1A2E',
        'on-secondary': '#2f2e43',
        'secondary-container': '#47475d',

        'accent-mint': '#00FF88',
        'accent-cyan': '#00D4FF',

        tertiary: '#ffb1c1',
        'on-tertiary': '#63092a',

        'text-primary': '#FFFFFF',
        'text-muted': 'rgba(255, 255, 255, 0.55)',

        'border-low-opacity': 'rgba(47, 141, 70, 0.25)',

        'glass-surface': 'rgba(255, 255, 255, 0.05)',

        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',

        'outline': '#899486',
        'outline-variant': '#3f493e',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-mono': ['14px', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '500' }],
        'code-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        base: '4px',
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '48px',
        xl: '80px',
        'container-max': '1280px',
        gutter: '24px'
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
        glass: '16px'
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.15)',
        'glass-hover': '0 8px 40px rgba(0, 255, 136, 0.08), 0 4px 30px rgba(0, 0, 0, 0.15)',
        'neon': '0 0 10px rgba(0, 255, 136, 0.2), 0 0 20px rgba(0, 255, 136, 0.1), 0 0 40px rgba(0, 255, 136, 0.05)',
        'neon-strong': '0 0 15px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.2), 0 0 60px rgba(0, 255, 136, 0.1)',
        'neon-cyan': '0 0 10px rgba(0, 212, 255, 0.2), 0 0 20px rgba(0, 212, 255, 0.1)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        glass: '20px',
        heavy: '40px'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'orb-1': 'orb-float-1 20s ease-in-out infinite',
        'orb-2': 'orb-float-2 25s ease-in-out infinite',
        'orb-3': 'orb-float-3 22s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  },
  plugins: []
};
