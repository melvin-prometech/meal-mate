import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/nextjs",
};

export default config;
