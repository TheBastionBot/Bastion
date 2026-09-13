/*!
 * @author TRACTION (iamtraction)
 * @copyright 2026
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: [ "test/**/*.test.ts" ],
        coverage: {
            provider: "v8",
            include: [ "src/**/*.ts" ],
            reporter: [ "text", "html", "json-summary" ],
            reportsDirectory: "coverage",
        },
    },
});
