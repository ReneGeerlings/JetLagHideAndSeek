import pluginJs from "@eslint/js";
import pluginImportAlias from "eslint-plugin-import-alias";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

import tsconfig from "./tsconfig.json" with { type: "json" };

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            "import-alias": pluginImportAlias,
            "simple-import-sort": simpleImportSort,
        },
        settings: {
            react: {
                version: "19",
            },
        },
        rules: {
            "import-alias/import-alias": [
                "error",
                {
                    relativeDepth: 0,
                    aliases: Object.entries(tsconfig.compilerOptions.paths).map(
                        ([to, [from]]) => ({
                            alias: to.replace(/\*$/, ""),
                            matcher: from.replace(/^\.\//, "^"),
                        }),
                    ),
                },
            ],
            "react/react-in-jsx-scope": "off",
            // E2 lock-in: 'warn' i.p.v. 'off' zodat nieuwe any's zichtbaar
            // worden zonder de ~160 bestaande te markeren. De CI-grens hieronder
            // (via --max-warnings in package.json) voorkomt dat het er meer
            // worden — pas die naar beneden bij elke nette opruim-actie.
            "@typescript-eslint/no-explicit-any": "warn",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
];
