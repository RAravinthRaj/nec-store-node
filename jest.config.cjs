/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest/presets/default-esm", // 👈 ESM support
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // for correct file extension resolution
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  testMatch: ["**/tests/**/*.test.ts"],
};
