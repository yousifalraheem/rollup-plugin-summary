const summary = require("../dist");

export default {
  input: "index.js",
  output: [
    {
      dir: "temp/esm",
      format: "esm",
      esModule: true,
      preserveModules: true,
    },
    {
      dir: "temp/umd",
      format: "cjs",
      esModule: true,
      preserveModules: true,
    },
  ],
  plugins: [
    summary({
      warnLow: 200,
      warnHigh: 800,
      totalLow: 1e3,
      totalHigh: 2e3,
      showMinifiedSize: true,
      showBrotliSize: true,
      showGzippedSize: true,
    }),
  ],
};
