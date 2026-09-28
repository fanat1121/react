import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "node:path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../_pages/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          ioredis: require.resolve("./__mocks__/ioredis.ts"),
          // SCSSの`@use '@/styles/variables'`はtsconfig pathsでは解決されないため明示する
          "@": path.resolve(__dirname, ".."),
        },
      },
    }),
};
export default config;