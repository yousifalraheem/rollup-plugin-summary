import filesize from "rollup-plugin-filesize";
import asTable from "as-table";
import { green, yellowBright, red, bold } from "chalk";

/**
 * Replacement for `??` which is only supported in node version 14 and above
 * @param {any} val The value to be checked
 * @param {any} def A default value to fallback to if the value is `null` or `undefined`
 * @returns The value or the default value
 */
function defaultIfEmpty(val, def) {
    return (val === null || val === undefined) ? def : val;
}

/**
 * Show summary of compiled files
 * @param {{
 *   warnLow?: number;
 *   warnHigh?: number;
 *   totalLow?: number;
 *   totalHigh?: number;
 *   showBrotliSize?: boolean;
 *   showMinifiedSize?: boolean;
 *   showGzippedSize?: boolean;
 * }} options Plugin options
 */
export default function (options = {}) {
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

    let sizes = [];
    let columnsMaxValue = {
        Name: '',
        Size: '',
        Minified: '',
        Gzipped: '',
        Brotli: '',
    }
    let totalSize = 0;
    let totalMinified = 0;
    let totalGzipped = 0;
    let totalBrotli = 0;

    const defaultOptions = {
        warnLow: defaultIfEmpty(options.warnLow, 5e3),
        warnHigh: defaultIfEmpty(options.warnHigh, 1e4),
        totalLow: defaultIfEmpty(options.totalLow, 2e5),
        totalHigh: defaultIfEmpty(options.totalHigh, 3e5),
        showBrotliSize: defaultIfEmpty(options.showBrotliSize, true),
        showGzippedSize: defaultIfEmpty(options.showGzippedSize, true),
        showMinifiedSize: defaultIfEmpty(options.showMinifiedSize, true),
    };

    return {
        name: "rollup-plugin-summary",
        generateBundle: async function (...args) {
            // Reset ahead of calculations
            totalSize = totalMinified = totalGzipped = totalBrotli = 0;
            sizes = [];

            await filesize({
                showBrotliSize: defaultOptions.showBrotliSize,
                showGzippedSize: defaultOptions.showGzippedSize,
                showMinifiedSize: defaultOptions.showMinifiedSize,
                reporter: (options, bundle, { fileName, bundleSize, minSize, gzipSize, brotliSize }) => {
                    // Calculating totals
                    totalSize += calculateByteSize(bundleSize || "0 B");

                    const entry = {
                        Name: fileName,
                        Size: getReadableSize({ value: calculateByteSize(bundleSize || "0 B"), ...defaultOptions }),
                    }

                    if (defaultOptions.showMinifiedSize) {
                        totalMinified += calculateByteSize(minSize || "0 B");
                        entry.Minified = getReadableSize({ value: calculateByteSize(minSize || "0 B"), ...defaultOptions });
                    }
                    if (defaultOptions.showGzippedSize) {
                        totalGzipped += calculateByteSize(gzipSize || "0 B");
                        entry.Gzipped = getReadableSize({ value: calculateByteSize(gzipSize || "0 B"), ...defaultOptions });
                    }
                    if (defaultOptions.showBrotliSize) {
                        totalBrotli += calculateByteSize(brotliSize || "0 B");
                        entry.Brotli = getReadableSize({ value: calculateByteSize(brotliSize || "0 B"), ...defaultOptions });
                    }

                    // Archiving entries
                    sizes.push(entry);

                    const max = (a, b) => a.length > b.length ? a : b;
                    columnsMaxValue.Name = max(columnsMaxValue.Name, fileName);
                }
            }).generateBundle(...args);

            columnsMaxValue = {
                Name: columnsMaxValue.Name,
                Size: getReadableSize({ value: totalSize, isTotal: true, ...defaultOptions, colored: false }),
            }
            if (defaultOptions.showMinifiedSize) {
                columnsMaxValue.Minified = getReadableSize({ value: totalMinified, isTotal: true, ...defaultOptions, colored: false });
            }
            if (defaultOptions.showGzippedSize) {
                columnsMaxValue.Gzipped = getReadableSize({ value: totalGzipped, isTotal: true, ...defaultOptions, colored: false });
            }
            if (defaultOptions.showBrotliSize) {
                columnsMaxValue.Brotli = getReadableSize({ value: totalBrotli, isTotal: true, ...defaultOptions, colored: false });
            }

            const makeDashes = (times) => "-".repeat(times);

            sizes = sizes.sort((a, b) => a.Name.localeCompare(b.Name));

            const dashes = {
                Name: makeDashes(columnsMaxValue.Name.length),
                Size: makeDashes(columnsMaxValue.Size.length),
            }
            const totals = {
                Name: "Total",
                Size: getReadableSize({ value: totalSize, isTotal: true, ...defaultOptions }),
            }

            if (defaultOptions.showMinifiedSize) {
                dashes.Minified = makeDashes(columnsMaxValue.Minified.length);
                totals.Minified = getReadableSize({ value: totalMinified, isTotal: true, ...defaultOptions });
            }
            if (defaultOptions.showGzippedSize) {
                // 2 is to get the dashes to reach the right end of the table
                dashes.Gzipped = makeDashes(columnsMaxValue.Gzipped.length);
                totals.Gzipped = getReadableSize({ value: totalGzipped, isTotal: true, ...defaultOptions });
            }
            if (defaultOptions.showBrotliSize) {
                // 2 is to get the dashes to reach the right end of the table
                dashes.Brotli = makeDashes(columnsMaxValue.Brotli.length + 2);
                totals.Brotli = getReadableSize({ value: totalBrotli, isTotal: true, ...defaultOptions });
            }

            // Adding totals (footer)
            sizes.push(dashes, totals);
            // Printing
            console.info(`\n${bold("📄 Generated files:\n")}\n${asTable(sizes.map(item => {
                const output = {
                    Name: item.Name,
                    Size: item.Size,
                }
                if (defaultOptions.showMinifiedSize) {
                    output.Minified = item.Minified;
                }
                if (defaultOptions.showGzippedSize) {
                    output.Gzipped = item.Gzipped;
                }
                if (defaultOptions.showBrotliSize) {
                    output.Brotli = item.Brotli;
                }
                return output;
            }))}\n`);
        }
    }
}
