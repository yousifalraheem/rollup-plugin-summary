import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import externals from "rollup-plugin-node-externals";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const esModules = ["gzip-size"];
/** @type {string[]} */
const external = Object.keys(pkg.dependencies).filter(ext => !esModules.includes(ext));

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      format: "cjs",
      file: pkg.main,
      exports: "named",
      footer: "module.exports = Object.assign(exports.default, exports);",
      sourcemap: true
    },
    {
      format: "es",
      file: pkg.module,
      plugins: [
        {
          name: "emit-module-package-file",
          generateBundle() {
            this.emitFile({
              type: "asset",
              fileName: "package.json",
              source: `{"type":"module"}`
            });
          }
        }
      ],
      sourcemap: true
    }
  ],
  external,
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    externals(),
    typescript({ sourceMap: true })
  ],
  onwarn(warning, rollupWarn) {
    if (!["CIRCULAR_DEPENDENCY", "EVAL"].includes(warning.code)) {
      rollupWarn(warning);
    }
  }
});
