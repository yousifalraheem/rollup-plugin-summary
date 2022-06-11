import Table from "cli-table3";
import {
  getMinifiedSize,
  getFileSize,
  getGzippedSize,
  getBrotliSize,
  reportWarning,
  generateSeparator,
  uuid,
  color,
} from "./utils";
import { OutputChunk, Plugin } from "rollup";

/** Prints out a summary of the rollup build */
export function summary({
  warnLow = 5e3,
  warnHigh = 1e4,
  totalLow = 2e5,
  totalHigh = 3e5,
  showBrotliSize = false,
  showGzippedSize = false,
  showMinifiedSize = false,
}: SummaryOptions = {}): Plugin {
  const info = new Map<string, SummaryChunkInfo[]>();

  return {
    name: "rollup-plugin-summary",
    generateBundle: async function (options, bundle) {
      const identifierList = [];
      options.dir && identifierList.push(options.dir);
      options.file && identifierList.push(options.file);
      options.format && identifierList.push(options.format);
      const identifier = identifierList.length ? identifierList.join(" - ") : uuid();
      info.clear();
      info.set(identifier, []);
      const defaultDescriptor = (): ValueDescriptor => ({
        value: 0,
        displayValue: "0 B",
        coloredValue: "0 B",
      });
      const totals: SummaryChunkInfo = { fileName: "Totals", size: defaultDescriptor() };
      for (const fileName in bundle) {
        if (bundle[fileName].type === "chunk") {
          const chunk = bundle[fileName];
          // TODO: Investigate this
          const code = (chunk as OutputChunk).code;
          const warn: [number, number] = [warnLow || 0, warnHigh || 0];
          const totalWarn: [number, number] = [totalLow || 0, totalHigh || 0];
          /** @type {SummaryChunkInfo} */
          const chunkInfo: SummaryChunkInfo = { fileName, size: defaultDescriptor() };
          chunkInfo.size.value = Buffer.byteLength(code);
          chunkInfo.size.displayValue = getFileSize(chunkInfo.size.value);
          chunkInfo.size.coloredValue = reportWarning(chunkInfo.size, ...warn);
          totals.size.value += chunkInfo.size.value;
          totals.size.displayValue = getFileSize(totals.size.value);
          totals.size.coloredValue = reportWarning(totals.size, ...totalWarn);

          if (showMinifiedSize) {
            if (!chunkInfo.minified) {
              chunkInfo.minified = defaultDescriptor();
            }
            if (!totals.minified) {
              totals.minified = defaultDescriptor();
            }
            chunkInfo.minified.value = await getMinifiedSize(code);
            chunkInfo.minified.displayValue = getFileSize(chunkInfo.minified.value);
            chunkInfo.minified.coloredValue = reportWarning(chunkInfo.minified, ...warn);
            totals.minified.value += chunkInfo.minified.value;
            totals.minified.displayValue = getFileSize(totals.minified.value);
            totals.minified.coloredValue = reportWarning(totals.minified, ...totalWarn);
          }

          if (showGzippedSize) {
            if (!chunkInfo.gzipped) {
              chunkInfo.gzipped = defaultDescriptor();
            }
            if (!totals.gzipped) {
              totals.gzipped = defaultDescriptor();
            }
            chunkInfo.gzipped.value = await getGzippedSize(code);
            chunkInfo.gzipped.displayValue = getFileSize(chunkInfo.gzipped.value);
            chunkInfo.gzipped.coloredValue = reportWarning(chunkInfo.gzipped, ...warn);
            totals.gzipped.value += chunkInfo.gzipped.value;
            totals.gzipped.displayValue = getFileSize(totals.gzipped.value);
            totals.gzipped.coloredValue = reportWarning(totals.gzipped, ...totalWarn);
          }

          if (showBrotliSize) {
            if (!chunkInfo.brotli) {
              chunkInfo.brotli = defaultDescriptor();
            }
            if (!totals.brotli) {
              totals.brotli = defaultDescriptor();
            }
            chunkInfo.brotli.value = await getBrotliSize(code);
            chunkInfo.brotli.displayValue = getFileSize(chunkInfo.brotli.value);
            chunkInfo.brotli.coloredValue = reportWarning(chunkInfo.brotli, ...warn);
            totals.brotli.value += chunkInfo.brotli.value;
            totals.brotli.displayValue = getFileSize(totals.brotli.value);
            totals.brotli.coloredValue = reportWarning(totals.brotli, ...totalWarn);
          }
          info.get(identifier)!.push(chunkInfo);
        }
      }
      info.get(identifier)!.push(totals);
    },
    closeBundle: async function () {
      const [ dir, output ]: [ dir: string, output: SummaryChunkInfo[]] = info.entries().next().value;
      /** @type {string[]} */
      const headers = ["File name", "Size"];
      showMinifiedSize && headers.push("Minified");
      showGzippedSize && headers.push("Gzipped");
      showBrotliSize && headers.push("Brotli");
      const table = new Table({
        head: headers,
        chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
        style: { head: ["blue"] },
      });

      const printable = output.map(file => {
        const output = [file.fileName, file.size.coloredValue];
        showMinifiedSize && output.push(file.minified!.coloredValue);
        showGzippedSize && output.push(file.gzipped!.coloredValue);
        showBrotliSize && output.push(file.brotli!.coloredValue);
        return output;
      });
      const totalsRow: string[] = printable.pop()!;

      const separator = generateSeparator([
        headers,
        ...output.map(file => {
          const output = [file.fileName, file.size.displayValue];
          showMinifiedSize && output.push(file.minified!.displayValue);
          showGzippedSize && output.push(file.gzipped!.displayValue);
          showBrotliSize && output.push(file.brotli!.displayValue);
          return output;
        }),
      ]);

      table.push(separator);
      table.push(...printable);
      table.push(separator);
      table.push(totalsRow);

      console.log("Build summary for", color.cyan(dir));
      console.log(table.toString());
    },
  };
}

export default summary;
