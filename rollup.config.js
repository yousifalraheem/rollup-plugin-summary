import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import externals from "rollup-plugin-node-externals";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const esModules = ["gzip-size"];
/** @type {string[]} */
const external = Object.keys(pkg.dependencies).filter(
  ext => ext === esModules.includes("gzip-size"),
);

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
  external,
  plugins: [resolve({ preferBuiltins: true }), commonjs(), json(), externals(), typescript()],
  onwarn(warning, rollupWarn) {
    if (!["CIRCULAR_DEPENDENCY", "EVAL"].includes(warning.code)) {
      rollupWarn(warning);
    }
  },
});
