// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: [
        "json",
        "text",
        "lcov",
        "clover"
    ],
    moduleFileExtensions: ["js"],
    testEnvironment: "node",
    testMatch: [
        "**/tests/*.test.js"
    ],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
};
