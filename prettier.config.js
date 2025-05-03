/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    endOfLine: 'auto',
    printWidth: 80,
    overrides: [
        {
            files: ['*.yaml', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
