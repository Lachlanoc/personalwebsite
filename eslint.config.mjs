import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // The pages are mostly prose; plain apostrophes in JSX text are fine.
      "react/no-unescaped-entities": "off",
      // A static export has no image optimiser, so next/image adds nothing;
      // images go through SiteImage and scripts/optimize-images.mjs instead.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
