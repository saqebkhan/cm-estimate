/** @type {import('tailwindcss').Config} */
import extendConfig from "cm-uicomponents/tailwind.config";

extendConfig.theme.extend.skew = {
  ...extendConfig.theme.extend.skew,

  // Skew used in header
  30: "30deg",
};

extendConfig.theme.extend.backgroundImage = {
  ...extendConfig.theme.extend.backgroundImage,

  // gradient used in header and mobile header
  "gradient-header":
    "linear-gradient(to right,rgb(179, 0, 0),rgb(190, 0, 0),rgb(190, 0, 0),rgb(180, 0, 0),rgb(178, 3, 3),rgb(158, 3, 3))",
};

const customWidth = {
  15: "3.75rem",
  25: "6.25rem",
  30: "7.5rem",
};

extendConfig.theme.extend["screens"] = {
  lg: "1024px",
};

extendConfig.theme.extend["flexBasis"] = {
  "3/8": "37.5%",
};

extendConfig.theme.extend.width = {
  ...extendConfig.theme.extend.width,
  ...customWidth,
};

module.exports = {
  ...extendConfig,
  content: [
    "./src/**/*.{vue,js,ts}",
    "./node_modules/cm-uicomponents/dist/**/*.js",
  ],
};
