declare interface SummaryOptions {
  /**
   * Minimum size in bytes to be highlighted in yellow.
   * @default 5000
   * @description
   * This is used to warn (in yellow) about the files whom on the brink of exceeding the acceptable pre-defined file size
   */
  warnLow?: number;
  /**
   * Minimum size in bytes to be highlighted in red.
   * @default 10000
   * @description
   * This is used to alert (in red) about files that exceeded the acceptable pre-defined file size
   */
  warnHigh?: number;
  /**
   * Minimum total size in bytes to be highlighted in yellow.
   * @default 200000
   * @description
   * This is used to warn (in yellow) about the total build size if it comes nearly below maximum acceptable pre-defined size
   */
  totalLow?: number;
  /**
   * Minimum total size in bytes to be highlighted in red.
   * @default 300000
   * @description
   * This is used to alert (in red) about the total build size if it exceeds the acceptable pre-defined size
   */
  totalHigh?: number;
  /**
   * Show file size in Brotli compression.
   * @default true
   */
  showBrotliSize?: boolean;
  /**
   * Show file size minified.
   * @default true
   */
  showMinifiedSize?: boolean;
  /**
   * Show file size Gzipped.
   * @default true
   */
  showGzippedSize?: boolean;
}

declare interface ValueDescriptor {
  value: number;
  displayValue: string;
  coloredValue: string;
}

declare interface SummaryChunkInfo {
  fileName: string;
  size: ValueDescriptor;
  minified?: ValueDescriptor;
  gzipped?: ValueDescriptor;
  brotli?: ValueDescriptor;
}

declare type LogColors =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray";

declare function summary(opts?: SummaryOptions): import("rollup").Plugin;
