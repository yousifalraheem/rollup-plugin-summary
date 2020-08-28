declare module "rollup-plugin-summary" {
    export interface SummaryOptions {
        /** Minimum size in bytes to be highlighted in yellow. Default: `5000` */
        warnLow: number;
        /** Minimum size in bytes to be highlighted in red. Default: `10000` */
        warnHigh: number;
        /** Minimum total size in bytes to be highlighted in yellow. Default: `200000` */
        totalLow: number;
        /** Minimum total size in bytes to be highlighted in red. Default: `300000` */
        totalHigh: number;
    }

    /**
     * Prints out a summary of the rollup build
     * @param {SummaryOptions} options Summary plugin options
     */
    export default function summary(options: SummaryOptions): void;
}
