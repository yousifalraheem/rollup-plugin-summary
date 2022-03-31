jest.mock("gzip-size");
import { generateSeparator } from "../utils";

describe("Utility functions", () => {
  describe("generateSeparator", () => {
    it("Should work", () => {
      const row = Array(3).fill("test");
      expect(generateSeparator(Array(3).fill(row))[0]).toHaveLength(4);
    });
  });
});
