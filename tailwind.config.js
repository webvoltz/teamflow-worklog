// // tailwind.config.js
import flowbite from 'flowbite-react/tailwind';
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './public/index.html',
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'regal-gray': 'rgba(107, 114, 128, 1)',
        'text-color': 'rgba(17, 25, 40, 1)',
        primary: '#3D75FF',
        lightgray: '#101828',
      },

      fontFamily: {
        inter: ['Inter', ' sans-serif'],
      },
    },
  },
  plugins: [flowbite.plugin()],
};
export default config;
