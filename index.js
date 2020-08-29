import filesize from "rollup-plugin-filesize";
import asTable from "as-table";
import { green, yellowBright, red, bold } from "chalk";

function colorize(value, color) {
    switch (color) {
        case "green": return green(value);
        case "yellow": return yellowBright(value);
        case "red": return red(value);
        default: return value;
    }
}

function calculateByteSize(value) {
    let [num, unit] = value.split(" ");
    switch (unit) {
        case "B": return parseFloat(num);
        case "KB": return parseFloat(num) * 1e3;
        case "MB": return parseFloat(num) * 1e6;
        case "GB": return parseFloat(num) * 1e9;
        default: return num;
    }
}

function toReadableNumber(num) {
    return num.toLocaleString("en", { maximumFractionDigits: 2 });
}

function getReadableSize({ value, isTotal, warnLow, warnHigh, totalLow, totalHigh, colored = true } = {}) {
    let result;
    value = parseFloat(value);
    // File size unit
    switch (true) {
        case value < 1e3: result = toReadableNumber(value) + " B"; break;
        case value >= 1e3 && value < 1e6: result = toReadableNumber(value / 1e3) + " KB"; break;
        case value >= 1e6 && value < 1e9: result = toReadableNumber(value / 1e6) + " MB"; break;
        default: result = String(value.toFixed());
    }

    if (colored) {
        const low = isTotal ? totalLow : warnLow;
        const high = isTotal ? totalHigh : warnHigh;
        const color = value < low ? "green" : value < high ? "yellow" : "red";
        return colorize(result, color);
    } else {
        return result;
    }
}

const sizes = [];
let columnsMaxValue = {
    Name: '',
    Size: '',
    Minified: '',
    Gzipped: '',
}
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
                    // Calculating ttals
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

                    const max = (a, b) => a.length > b.length ? a : b;

                    columnsMaxValue.Name = max(columnsMaxValue.Name, fileName);
                }
            }).generateBundle(...args);

            columnsMaxValue = {
                Name: columnsMaxValue.Name,
                Size: getReadableSize({ value: totalSize, isTotal: true, ...defaultOptions, colored: false }),
                Minified: getReadableSize({ value: totalMinified, isTotal: true, ...defaultOptions, colored: false }),
                Gzipped: getReadableSize({ value: totalGzipped, isTotal: true, ...defaultOptions, colored: false }),
            }

            const makeDashes = (times) => "-".repeat(times);

            // Adding totals (footer)
            sizes.push(
                {
                    Name: makeDashes(columnsMaxValue.Name.length),
                    Size: makeDashes(columnsMaxValue.Size.length),
                    Minified: makeDashes(columnsMaxValue.Minified.length),
                    Gzipped: makeDashes(columnsMaxValue.Gzipped.length + 2), // 2 is to get the dashes to reach the right end of the table
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
