module.exports = {
    root: true,
    overrides: [
        {
            env: {
                browser: true,
                es6: true,
            },
            excludedFiles: ['**/gulpfile.js'],
            files: ['*.ts', '*.tsx'],
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            plugins: ['@typescript-eslint', 'prettier'],
            rules: { 'prettier/prettier': 'warn' },
        },
        {
            env: {
                node: true,
                es6: true,
            },
            files: ['gulpfile.js'],
            extends: ['eslint:recommended', 'prettier'],
            plugins: ['prettier'],
            rules: { 'prettier/prettier': 'warn' },
        }
      ]
};