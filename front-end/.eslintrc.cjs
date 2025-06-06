module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh'],
    rules: {
        'react/jsx-no-target-blank': 'off',
        'no-unused-vars': 'off',
        'react/prop-types': 0,
        'no-empty': 0,
        'react-hooks/exhaustive-deps': 0,
        'no-case-declarations': 0,
        'react-refresh/only-export-components': [
            'warn',
            {
                allowExportNames: ['useLoading', 'useAuth'],
            },
        ],
    },
};
