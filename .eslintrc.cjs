module.exports = {
    parser: '@typescript-eslint/parser',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],

            extends: [
                //  Use the recommended rules from the @typescript-eslint/eslint-plugin
                'plugin:@typescript-eslint/recommended',
                'prettier',
            ],
            parserOptions: {
                project: [__dirname + '/tsconfig.json'],
            },
            rules: {
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/ban-types': 'off',
            },
            excludedFiles: ['tests/**/*.ts'],
        },
        {
            files: ['tests/**/*.ts'],
            extends: [
                //  Use the recommended rules from the @typescript-eslint/eslint-plugin
                'plugin:@typescript-eslint/recommended',
                'prettier',
            ],
            parserOptions: {
                project: [__dirname + '/tests/tsconfig.json'],
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
            }
        },
        {
            files: ['*.mjs', '*.js', '*.jsx', '*.es', '*.cjs'],
        },
    ],
    plugins: ['@typescript-eslint', 'prettier'],

    rules: {
        'prettier/prettier': 'error',
        'no-console': 'off',
        'no-bitwise': 'off',
    },
};
