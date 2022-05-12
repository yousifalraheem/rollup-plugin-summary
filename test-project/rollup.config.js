import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import externals from "rollup-plugin-node-externals";
import { defineConfig } from "rollup";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { summary } = require("../dist");

const configs = defineConfig({
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
    commonjs(),
    resolve(),
    externals(),
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
});

export default configs;
