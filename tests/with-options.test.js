import plugin from "../index.js";

jest.mock("rollup-plugin-filesize");
import filesize from "rollup-plugin-filesize";

describe("Testing rollup plugin - with extra options", () => {
    const setup = (reports) => {
        filesize.mockImplementation((options) => {
            const { reporter } = options;

            reports.map((report) => reporter(null, null, report));

            return {
                generateBundle: function (props) { }
            }
        });
        return {
            mockedModule: jest.mock("rollup-plugin-filesize", () => ({
                generateBundle: jest.fn()
            }))
        }
    }

    it("Should accept custom warning sizes", () => {
        let consoleSpy = jest.spyOn(console, "info").mockImplementation();

        setup([
            {
                fileName: "NewTestFile",
                bundleSize: "50 B",
                minSize: "100 B",
                gzipSize: "200 MB"
            },
            {
                fileName: "a_very_very_very_very_long_name",
                bundleSize: "50 B",
                minSize: "100 B",
                gzipSize: "200 MB"
            },
            {
                fileName: "lorem_ipsum_name",
                bundleSize: "50 GB",
                minSize: "100 TB",
                gzipSize: "200 MB"
            }
        ]);

        plugin({
            warnLow: 100,
            warnHigh: 200,
            totalLow: 300,
            totalHigh: 400
        }).generateBundle();
        plugin().generateBundle();

        const summary = consoleSpy.mock.calls[0][0].split("\n").filter(item => !!item.trim());

        // Pre-total dashes
        const longest = "a_very_very_very_very_long_name".length;
        expect(summary[6].split(" ")[0].length).toEqual(longest);

        // Above GB is not supported
        expect(summary[5].includes("50000000000")).toBeTruthy();
    });
});
