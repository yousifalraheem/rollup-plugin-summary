import type { JestConfigWithTsJest } from "ts-jest";

const esModules = ["gzip-size"].join("|");

const config: JestConfigWithTsJest = {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coveragePathIgnorePatterns: [
    "node_modules",
    "<rootDir>/src/typings",
    "<rootDir>/src/__mocks__",
    "<rootDir>/src/__tests__",
  ],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,ts}", "<rootDir>/**/*.{spec,test}.{js,ts}"],
  testPathIgnorePatterns: ["node_modules"],
  modulePathIgnorePatterns: ["<rootDir>/src/__tests__/setupTests.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setupTests.ts"],
};

export default config;
