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
        'no-unused-vars': 'off',
        indent: ['error', 4],
        'linebreak-style': 'off',
        'import/no-unresolved': 'off',
        'no-shadow': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'consistent-return': 'warn',
        'no-underscore-dangle': 'off',
        camelcase: 'off',
        'prefer-destructuring': 'off',
    },
};
