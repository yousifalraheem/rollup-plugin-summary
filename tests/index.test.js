import summary from "../";
import bundles from "./bundles.json";

// eslint-disable-next-line no-control-regex
const ansiRegex = /[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g;

describe("Rollup plugin summary", () => {
  /** @type {any} */
  const options = { dir: "temp/esm" };
  const log = jest.fn();
  jest.spyOn(console, "log").mockImplementation(log);

  beforeEach(log.mockClear);

  it("Should return the correct plugin structure", () => {
    const plugin = summary();
    expect(plugin.name).toEqual("rollup-plugin-summary");
    expect(typeof plugin.generateBundle).toEqual("function");
    expect(typeof plugin.closeBundle).toEqual("function");
  });

  it("Should generate summary correctly using defaults", async () => {
    const plugin = summary();
    await plugin.generateBundle(options, bundles, true);
    plugin.closeBundle();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log).toHaveBeenNthCalledWith(1, "Build summary for", expect.stringContaining(options.dir));

    /** @type {string[]} */
    const outputTable = log.mock.calls[1][0].split("\n").map(i => i.replace(ansiRegex, ""));
    // Column names
    expect(outputTable[1]).toContain("File name");
    expect(outputTable[1]).toContain("Size");
    // Separator at least 9 to cover the column names
    expect(outputTable[2]).toContain("-".repeat(9));
    // File names
    const fileNames = Object.keys(bundles);
    expect(outputTable[3]).toContain(fileNames[0]);
    expect(outputTable[4]).toContain(fileNames[1]);
    // Separator at least 9 to cover the column names
    expect(outputTable[5]).toContain("-".repeat(9));
    // Totals column
    expect(outputTable[6]).toContain("Totals");
    // File sizes
    expect(/\d+\s\w/.test(outputTable[3])).toBeTruthy();
    expect(/\d+\s\w/.test(outputTable[4])).toBeTruthy();
    expect(/\d+\s\w/.test(outputTable[6])).toBeTruthy();
  });

  it("Should do the proper compression when passed", async () => {
    const plugin = summary({
      showBrotliSize: true,
      showGzippedSize: true,
      showMinifiedSize: true,
    });
    await plugin.generateBundle(options, bundles, true);
    plugin.closeBundle();
    /** @type {string[]} */
    const outputTable = log.mock.calls[1][0].split("\n").map(i => i.replace(ansiRegex, ""));
    // Column names
    expect(outputTable[1]).toContain("File name");
    expect(outputTable[1]).toContain("Size");
    expect(outputTable[1]).toContain("Minified");
    expect(outputTable[1]).toContain("Gzipped");
    expect(outputTable[1]).toContain("Brotli");
    // File sizes. Should match 4 file sizes
    expect(outputTable[3].match(/\d+\s\w/g)).toHaveLength(4);
    expect(outputTable[4].match(/\d+\s\w/g)).toHaveLength(4);
    expect(outputTable[6].match(/\d+\s\w/g)).toHaveLength(4);
  });
});

// describe("Testing plugin", () => {
//   const consoleSpy = jest.spyOn(console, "info");
//
//   beforeEach(() => {
//     consoleSpy.mockClear();
//     chalk.green.mockClear().mockImplementation(colorize);
//     chalk.yellowBright.mockClear().mockImplementation(colorize);
//     chalk.red.mockClear().mockImplementation(colorize);
//     chalk.bold.mockClear().mockImplementation(colorize);
//   });
//
//   it("Should just work", () => {
//     /** @type {import('rollup').Plugin} */
//     const output = summary();
//     expect(output).not.toBeNull();
//     expect(output.name).toEqual("rollup-plugin-summary");
//     expect(output.generateBundle).toBeDefined();
//   });
//
//   describe("Should allow hiding selected compressions", () => {
//     const testCases = ["showBrotliSize", "showGzippedSize", "showMinifiedSize"];
//     setup([samples[0]]);
//
//     testCases.forEach(testCase => {
//       test(testCase, async () => {
//         await summary({ [testCase]: false }).generateBundle();
//         expect(consoleSpy).not.toBeCalledWith(expect.stringContaining(testCase));
//       });
//     });
//   });
//
//   it("Should allow changing file warn colors", async () => {
//     const sample = samples[0];
//     setup([sample]);
//     await summary({ warnLow: 80, warnHigh: 120 }).generateBundle();
//     expect(chalk.yellowBright).toBeCalledWith(sample.minSize);
//     expect(chalk.red).toBeCalledWith(sample.gzipSize);
//
//     chalk.yellowBright.mockReset();
//     chalk.red.mockReset();
//     await summary({ warnLow: 180 * 1e6, warnHigh: 250 * 1e6 }).generateBundle();
//     expect(chalk.yellowBright).toHaveBeenCalledWith(sample.gzipSize);
//     expect(chalk.red).toBeCalledWith(sample.brotliSize);
//   });
//
//   it("Should recognize sizes from B to GB", async () => {
//     setup(samples);
//     await summary().generateBundle();
//     expect(consoleSpy).toBeCalledWith(expect.stringContaining(" B"));
//     expect(consoleSpy).toBeCalledWith(expect.stringContaining(" KB"));
//     expect(consoleSpy).toBeCalledWith(expect.stringContaining(" MB"));
//     expect(consoleSpy).toBeCalledWith(expect.stringContaining(" GB"));
//   });
// });
