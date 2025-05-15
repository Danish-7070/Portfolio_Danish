/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // Light background color
        text: "#333333", // Light text color
        primary: "#EF4444", // Light primary color
        // custom:'#9ce37d',
        custom:'#94d678',
        // customDark:'#81c763',
        customDark:'#507a3d',
        customDark2:'#456c35',
        secondary: "#4c6663", // Light secondary colorr
        accent: "#f0f0f0", // Light accent color
        "btn-primary": "#9ce37d", // Button primary color (matches primary)
        "btn-secondary": "#4c6663", // Button secondary color (matches secondary)
        "btn-accent": "#f0f0f0", // Button accent color (matches accent)
        "btn-primary-hover": "#8dc66f", // Button primary hover color
        "btn-secondary-hover": "#3e5753", // Button secondary hover color
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animated")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#9ce37d", // Sets the primary color for btn-primary
          "primary-focus": "#8dc66f", // Focus color for primary button
          "primary-content": "#ffffff", // Text color for primary button
        },
      },
    ],
  },
};
