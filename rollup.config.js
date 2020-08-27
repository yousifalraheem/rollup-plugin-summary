import commonjs from "@rollup/plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import summary from "./index";

export default {
    input: "src/index.js",
    output: {
        dir: "dist",
        format: "esm",
        esModule: true,
        preserveModules: true
    },
    plugins: [
        resolve(),
        commonjs(),
        summary({
            warnLow: 60,
            warnHigh: 70,
            totalLow: 170,
            totalHigh: 180
        })
    ]
}