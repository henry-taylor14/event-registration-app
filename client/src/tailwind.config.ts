import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1F3A93',    // Deep blue
        'secondary': '#4C83FF',  // Light blue
        'accent': '#FF6B6B',     // Orange
        'background': '#F8F9FA', // Off-white
        'text': '#333333',       // Dark gray
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
    },
    
  },
  plugins: [],
};

export default config;