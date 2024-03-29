// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierConfig = require('eslint-config-prettier')

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['client/*'],
  rules: {
    'prettier/prettier': [
      1,
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
        printWidth: 100,
      },
    ],
    '@typescript-eslint/ban-ts-comment': [
      1,
      {
        'ts-ignore': false,
      },
    ],
    ...prettierConfig.rules,
  },
}
