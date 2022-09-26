module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.test.ts"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["node_modules"],
  coverageReporters: ["html", "json", "text-summary"],
  moduleFileExtensions: ["ts", "js"],
  modulePaths: ["<rootDir>/"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"]
};
