/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
            primary: '#28CB8B',
            hbg: 'rgba(0, 0, 0, 0.1)',

        },
        lineCamp: {
          3:'3',
          2:'2',
          1:'1',
        }
      },
    }, 
    plugins: [
      // eslint-disable-next-line no-undef
      //require('@tailwindcss/line-clamp'),  // Make sure the plugin is installed
    ],
  };