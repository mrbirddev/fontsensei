/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "react", "import"],
  extends: [
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],

    // These rules do not consider TS type guards https://stackoverflow.com/a/62915907/1922857
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",

    // conflict with no namespace
    "@typescript-eslint/prefer-namespace-keyword": "off",
    "@typescript-eslint/no-namespace": "off",

    "@next/next/no-html-link-for-pages": ["error", "src/pages/"],
    "react/jsx-curly-brace-presence": ["error", "never"], // To make no-html-link-for-pages work https://github.com/vercel/next.js/issues/63555

    // Please only import css in _app.tsx
    "no-restricted-imports": ["error", {
      "patterns": [{
        "group": ["*.scss", "*.css", "*.less"],
        "message": "Import styles in _app.tsx only"
      }],
    }],
  },

  'settings': {
    // for import/no-restricted-paths to work
    // https://github.com/import-js/eslint-plugin-import/issues/1928#issuecomment-715164532
    'import/resolver': {
      'node': {
        'extensions': [
          '.ts',
          '.tsx'
        ]
      }
    }
  },
};

module.exports = config;
