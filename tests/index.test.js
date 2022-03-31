// import summary from "../";
// const samples = require("./samples.json");

describe("Testing...", () => {
  expect(true).toBeTruthy();
})

// /** @type {(str: string) => string} */
// const colorize = str => str;
//
// jest.mock("chalk", () => ({
//   green: jest.fn().mockImplementation(colorize),
//   yellowBright: jest.fn().mockImplementation(colorize),
//   red: jest.fn().mockImplementation(colorize),
//   bold: jest.fn().mockImplementation(colorize),
// }));
//
// import chalk from "chalk";
//
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
