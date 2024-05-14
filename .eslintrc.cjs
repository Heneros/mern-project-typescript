module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'quotes': "double",
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'linebreak-style': ["error", "windows"],
  },
};
