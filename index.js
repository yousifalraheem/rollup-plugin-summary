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
    let [num, unit] = value.split(" ");
    switch (unit) {
        case "B": return parseFloat(num);
        case "KB": return parseFloat(num) * 1e3;
        case "MB": return parseFloat(num) * 1e6;
    }
}

function toReadableNumber(num) {
    return num.toLocaleString("en", { maximumFractionDigits: 2 });
}

function getReadableSize({ value, isTotal, warnLow, warnHigh, totalLow, totalHigh } = {}) {
    let result;
    value = parseFloat(value);
    // File size unit
    switch (true) {
        case value < 1e3: result = toReadableNumber(value) + " B"; break;
        case value >= 1e3 && value < 1e6: result = toReadableNumber(value / 1e3) + " KB"; break;
        case value >= 1e6 && value < 1e9: result = toReadableNumber(value / 1e6) + " MB"; break;
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
    const defaultOptions = {
        warnLow: options && options.warnLow || 5e3,
        warnHigh: options && options.warnHigh || 1e4,
        totalLow: options && options.totalLow || 2e5,
        totalHigh: options && options.totalHigh || 3e5
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
                        Size: getReadableSize({ value: calculateByteSize(bundleSize), ...defaultOptions }),
                        Minified: getReadableSize({ value: calculateByteSize(minSize), ...defaultOptions }),
                        Gzipped: getReadableSize({ value: calculateByteSize(gzipSize), ...defaultOptions }),
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
