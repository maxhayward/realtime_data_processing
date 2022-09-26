module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["infrastructure/*.ts"],
      excludedFiles: "iac/*.d.ts",
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 6 },
  plugins: ["@typescript-eslint"],
  root: true,
  settings: {
    react: {
      version: "detect",
    },
  },
};
