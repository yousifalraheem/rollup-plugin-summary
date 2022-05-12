/// <reference types="../typings" />
// jest.mock("gzip-size", () => ({ gzipSize: jest.fn().mockReturnValue(10) }));
import {
  getFileSize,
  generateSeparator,
  getMinifiedSize,
  getGzippedSize,
  getBrotliSize,
  reportWarning,
  color,
} from "../utils";

const file = `
"use strict";

function test() {
  const name = "TEST";
  console.log('This is a test', name);
}
`;
const fileSizeRegEx = /^\d+\sB/;

describe("Utility functions", () => {
  describe("getFileSize", () => {
    it("Should calculate the file size", () => {
      expect(getFileSize(file)).toMatch(fileSizeRegEx);
    });

    it("Should return the size number if a number is passed", () => {
      expect(getFileSize(30)).toEqual("30 B");
    });
  });

  describe("generateSeparator", () => {
    it("Should generate dashes row based on the content of the table", () => {
      const filler = "test";
      const row = Array(3).fill(filler);
      const table = Array(3).fill(row);
      const separatorRow = generateSeparator(table);
      const dashes = separatorRow[0].match(/-+/g)?.[0];
      expect(dashes).toHaveLength(filler.length);
    });
  });

  describe("File compression utilities", () => {
    const utils = [getMinifiedSize, getGzippedSize, getBrotliSize];

    utils.forEach(util => {
      test(util.name, async () => {
        const result = await util(file);
        expect(result).toEqual(expect.any(Number));
      });
    });
  });

  describe("reportWarning", () => {
    const warnLow = 10;
    const warnHigh = 20;
    const descriptor = {
      value: 0,
      get displayValue() {
        return this.value + " B";
      },
      get coloredValue() {
        return this.value + " B";
      },
    };

    it("Should report green when the value is within range", () => {
      descriptor.value = 8;
      const result = reportWarning(descriptor, warnLow, warnHigh);
      expect(result).toEqual(expect.stringContaining("8 B"));
      expect(result).toEqual(expect.stringContaining("\x1b[32m"));
    });

    it("Should report yellow when surpasses the low warning threshold", () => {
      descriptor.value = 15;
      const result = reportWarning(descriptor, warnLow, warnHigh);
      expect(result).toEqual(expect.stringContaining("15 B"));
      expect(result).toEqual(expect.stringContaining("\x1b[33m"));
    });

    it("Should report red when surpasses the high warning threshold", () => {
      descriptor.value = 25;
      const result = reportWarning(descriptor, warnLow, warnHigh);
      expect(result).toEqual(expect.stringContaining("25 B"));
      expect(result).toEqual(expect.stringContaining("\x1b[31m"));
    });
  });

  describe("color", () => {
    const testCases: Array<{ color: LogColors; colorCode: number }> = [
      { color: "black", colorCode: 30 },
      { color: "red", colorCode: 31 },
      { color: "green", colorCode: 32 },
      { color: "yellow", colorCode: 33 },
      { color: "blue", colorCode: 34 },
      { color: "magenta", colorCode: 35 },
      { color: "cyan", colorCode: 36 },
      { color: "white", colorCode: 37 },
      { color: "gray", colorCode: 90 },
    ];

    testCases.forEach(testCase => {
      test(testCase.color, () => {
        const result = color[testCase.color]("test");
        // Opening
        expect(result).toEqual(expect.stringContaining(`\x1b[${testCase.colorCode}m`));
        // Content
        expect(result).toEqual(expect.stringContaining("test"));
        // Closing
        expect(result).toEqual(expect.stringContaining("\x1b[0m"));
      });
    });
  });
});
