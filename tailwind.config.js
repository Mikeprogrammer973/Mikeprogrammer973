/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0D1117',
        panel: '#1E1E1E',
        accent: '#00FF7F',
        soft: '#252526'
      },
      fontFamily: {
        mono: ["'Fira Code'", 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
}
