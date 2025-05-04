// @ts-check

import css from '@eslint/css';
import { default as eslint, default as js } from '@eslint/js';
import json from '@eslint/json';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: { js },
        extends: [js.configs.recommended],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        extends: [eslint.configs.recommended],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
        extends: [
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-restricted-imports': [
                'error',
                {
                    name: 'react-redux',
                    importNames: ['useSelector', 'useDispatch'],
                    message:
                        'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
                },
            ],
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.jsx', '**/*.tsx'],
        extends: [
            pluginReact.configs.flat.recommended,
            pluginReactHooks.configs['recommended-latest'],
        ],
        rules: {
            'react/react-in-jsx-scope': 'off',
        },
    },
    globalIgnores([
        './.react-router/*',
        './build/*',
        './node_modules/*',
        './package-lock.json',
    ]),
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: [json.configs.recommended],
    },
    {
        files: ['**/*.jsonc'],
        plugins: { json },
        language: 'json/jsonc',
        extends: [json.configs.recommended],
    },
    {
        files: ['**/*.json5'],
        plugins: { json },
        language: 'json/json5',
        extends: [json.configs.recommended],
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: [css.configs.recommended],
    },
    eslintConfigPrettier,
);
