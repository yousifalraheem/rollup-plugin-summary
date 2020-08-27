import filesize from "rollup-plugin-filesize";
import asTable from "as-table";
import { green, yellowBright, red, bold } from "chalk";

function colorize(value, color) {
    switch (color) {
        case "green": return green(value);
        case "yellow": return yellowBright(value);
        case "red": return red(value);
    }
}

function calculateByteSize(value) {
    const [num, unit] = value.split(" ");
    switch (unit) {
        case "B": return parseFloat(num);
        case "KB": return parseFloat(num) * 1e3;
        case "MB": return parseFloat(num) * 1e6;
    }
}

function getReadableSize({ value, isTotal, warnLow, warnHigh, totalLow, totalHigh } = {}) {
    let result;
    value = parseFloat(value);
    // File size unit
    switch (true) {
        case value < 1e3: result = value.toFixed() + " B"; break;
        case value >= 1e3 && value < 1e6: result = value.toFixed() + " KB"; break;
        case value >= 1e6 && value < 1e9: result = value.toFixed() + " MB"; break;
        default: result = String(value.toFixed());
    }

    const low = isTotal ? totalLow : warnLow;
    const high = isTotal ? totalHigh : warnHigh;
    const color = value < low ? "green" : value < high ? "yellow" : "red";
    return colorize(result, color);
}

const sizes = [];
let totalSize = 0;
let totalMinified = 0;
let totalGzipped = 0;

export default function (options) {
    const defaultOptions = options || {
        warnLow: 5e3,
        warnHigh: 1e4,
        totalLow: 2e5,
        totalHigh: 3e5
    };

    return {
        name: "rollup-plugin-summary",
        generateBundle: function (...args) {
            filesize({
                reporter: (options, bundle, { fileName, bundleSize, minSize, gzipSize }) => {
                    // Calculating totals
                    totalSize += calculateByteSize(bundleSize);
                    totalMinified += calculateByteSize(minSize);
                    totalGzipped += calculateByteSize(gzipSize);

                    // Archiving entries
                    sizes.push({
                        Name: fileName,
                        Size: getReadableSize({ value: bundleSize.split(" ")[0], ...defaultOptions }),
                        Minified: getReadableSize({ value: minSize.split(" ")[0], ...defaultOptions }),
                        Gzipped: getReadableSize({ value: gzipSize.split(" ")[0], ...defaultOptions }),
                    });
                }
            }).generateBundle(...args);

            // Adding totals (footer)
            sizes.push(
                {
                    Name: "-----------",
                    Size: "-----",
                    Minified: "-----",
                    Gzipped: "-----",
                },
                {
                    Name: "Total",
                    Size: getReadableSize({ value: totalSize, isTotal: true, ...defaultOptions }),
                    Minified: getReadableSize({ value: totalMinified, isTotal: true, ...defaultOptions }),
                    Gzipped: getReadableSize({ value: totalGzipped, isTotal: true, ...defaultOptions }),
                }
            );
            // Printing
            console.info(`
                \n${bold("📄 Generated files:")}
                \n${asTable(sizes.map(item => ({ Name: item.Name, Size: item.Size, Minified: item.Minified, Gzipped: item.Gzipped })))}
            `);
        }
    }
}
