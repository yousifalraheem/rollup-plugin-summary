import { minify } from "terser";
import fileSize from "filesize";
import { gzipSize } from "gzip-size";
import brotli from "brotli-size";

/**
 * @param {string | number} input
 * @returns {string} Size in string format
 */
export function getFileSize(input) {
  /** @type {number} */
  const length = typeof input === "string" ? Buffer.byteLength(input) : input;
  return fileSize(length);
}

/**
 * @param {string} text
 * @returns {Promise<number>} Size in string format
 */
export async function getMinifiedSize(text) {
  return Buffer.byteLength((await minify(text)).code);
}

/**
 * @param {string} text
 * @returns {Promise<number>} Size in string format
 */
export async function getGzippedSize(text) {
  return await gzipSize(text);
}

/**
 * @param {string} text
 * @return {Promise<number>} Size in string format
 */
export async function getBrotliSize(text) {
  return brotli(text);
}

export const color = {
  black: str => `\x1b[30m${str}\x1b[0m`,
  red: str => `\x1b[31m${str}\x1b[0m`,
  green: str => `\x1b[32m${str}\x1b[0m`,
  yellow: str => `\x1b[33m${str}\x1b[0m`,
  blue: str => `\x1b[34m${str}\x1b[0m`,
  magenta: str => `\x1b[35m${str}\x1b[0m`,
  cyan: str => `\x1b[36m${str}\x1b[0m`,
  white: str => `\x1b[37m${str}\x1b[0m`,
  gray: str => `\x1b[90m${str}\x1b[0m`,
};

/**
 * @param {ValueDescriptor} descriptor
 * @param {number} warnLow
 * @param {number} warnHigh
 * @return {string} Colors string output
 */
export function reportWarning(descriptor, warnLow, warnHigh) {
  switch (true) {
    case descriptor.value > warnHigh:
      return color.red(descriptor.displayValue);
    case descriptor.value > warnLow:
      return color.yellow(descriptor.displayValue);
    default:
      return color.green(descriptor.displayValue);
  }
}

/**
 * @param {string[][]} list
 * @return {string[]} The separator row
 */
export function generateSeparator(list) {
  const numOfColumns = list[0].length;
  /** @type {string[]} */
  const output = Array(numOfColumns).fill("-");
  list.forEach(row => {
    row.forEach((str, i) => {
      if (str.length > output[i].length) {
        output[i] = "-".repeat(str.length);
      }
    });
  });
  return output.map(i => color.gray(i));
}
