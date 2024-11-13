const mantine = require("eslint-config-mantine");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
    ...mantine,
    {
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
    },
    { ignores: ["**/*.{mjs,cjs,js,d.ts,d.mts}"] }
);
