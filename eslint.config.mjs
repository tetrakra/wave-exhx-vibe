import globals from "globals";
import pluginJs from "@eslint/js";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...tailwind.configs["flat/recommended"],
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},

  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  {
    rules: {
        "no-unused-vars": "warn",
        "no-undef": "warn"
    },
    overrides: [
      {
        files: ['*.html', '*.blade.php'],
        parser: '@angular-eslint/template-parser',
      },
    ],
  }
  
];
