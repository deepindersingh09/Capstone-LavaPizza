/* eslint-disable no-undef */
const { FlatCompat } = require("@eslint/eslintrc");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const path = require("path");

const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
});

module.exports = [
  ...compat.extends("expo"),
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "build/**", ".next/**", "coverage/**"],
  },
];
