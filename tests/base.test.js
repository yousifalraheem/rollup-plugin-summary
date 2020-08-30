import plugin from "../index.js";

jest.mock("rollup-plugin-filesize");
import filesize from "rollup-plugin-filesize";

describe("Testing rollup plugin", () => {
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

    it("Should return a valid rollup plugin object", () => {
        expect(plugin).toBeDefined();
        const output = plugin();
        expect(output.name).toEqual("rollup-plugin-summary");
        expect(typeof output.generateBundle).toEqual("function");
    });

    it("Should render table correctly", () => {
        let consoleSpy = jest.spyOn(console, "info").mockImplementation();
        setup([
            {
                fileName: "testfile1",
                bundleSize: "1 B",
                minSize: "2 KB",
                gzipSize: "3 MB"
            },
            {
                fileName: "testfile2",
                bundleSize: "4 B",
                minSize: "5 KB",
                gzipSize: "600 MB"
            }
        ]);

        plugin().generateBundle();

        expect(consoleSpy).toBeCalled();

        const summary = consoleSpy.mock.calls[0][0].split("\n").filter(item => !!item.trim());

        expect(summary.length).toBe(7);
        // First statement
        expect(summary[0].includes("Generated files:")).toBeTruthy();
        // Table headers
        expect(summary[1].includes("Name")).toBeTruthy();
        expect(summary[1].includes("Size")).toBeTruthy();
        expect(summary[1].includes("Minified")).toBeTruthy();
        expect(summary[1].includes("Gzipped")).toBeTruthy();
        // File 1 summary
        expect(summary[3].includes("testfile1")).toBeTruthy();
        expect(summary[3].includes("1 B")).toBeTruthy();
        expect(summary[3].includes("2 KB")).toBeTruthy();
        expect(summary[3].includes("3 MB")).toBeTruthy();
        // File 2 summary
        expect(summary[4].includes("testfile2")).toBeTruthy();
        expect(summary[4].includes("4 B")).toBeTruthy();
        expect(summary[4].includes("5 KB")).toBeTruthy();
        expect(summary[4].includes("600 MB")).toBeTruthy();
        // Total summary
        expect(summary[6].includes("Total")).toBeTruthy();
        expect(summary[6].includes("5 B")).toBeTruthy();
        expect(summary[6].includes("7 KB")).toBeTruthy();
        expect(summary[6].includes("603 MB")).toBeTruthy();
        // Colors
        // Green for 1 MB
        expect(summary[4].includes("32m4 B")).toBeTruthy();;
        // Yellow for 5 KB
        expect(summary[4].includes("93m5 KB")).toBeTruthy();;
        // Red for 600 MB
        expect(summary[4].includes("31m600 MB")).toBeTruthy();;
    });
});
