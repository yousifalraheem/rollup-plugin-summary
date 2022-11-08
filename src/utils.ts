import { minify } from "terser";
import { filesize } from "filesize";
import { gzipSize } from "gzip-size";
import brotli from "brotli-size";

export function getFileSize(input: string | number): string {
  const length = typeof input === "string" ? Buffer.byteLength(input) : input;
  return filesize(length) as string;
}

export async function getMinifiedSize(text: string): Promise<number> {
  const minified = await minify(text);
  return Buffer.byteLength(minified.code || "");
}

export async function getGzippedSize(text: string): Promise<number> {
  return await gzipSize(text);
}

export async function getBrotliSize(text: string): Promise<number> {
  return brotli(text);
}

export const color: Record<LogColors, (str: string) => string> = {
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

export function reportWarning(descriptor: ValueDescriptor, warnLow: number, warnHigh: number) {
  switch (true) {
    case descriptor.value > warnHigh:
      return color.red(descriptor.displayValue);
    case descriptor.value > warnLow:
      return color.yellow(descriptor.displayValue);
    default:
      return color.green(descriptor.displayValue);
  }
}

export function generateSeparator(list: string[][]) {
  const numOfColumns = list[0].length;
  const output: string[] = Array(numOfColumns).fill("-");
  list.forEach(row => {
    row.forEach((str, i) => {
      if (str.length > output[i].length) {
        output[i] = "-".repeat(str.length);
      }
    });
  });
  return output.map(i => color.gray(i));
}

export function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
