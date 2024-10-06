import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
        sourceType: "module",
    },
    files: [ "src/**/*.ts" ],
    rules: {
        indent: [ "warn", 4 ],
        "linebreak-style": [ "warn", "unix" ],
        quotes: [ "warn", "double" ],
        semi: [ "warn", "always" ],
        "@typescript-eslint/no-namespace": "off",
    },
});
