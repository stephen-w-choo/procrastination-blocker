import React from "react";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { Preview } from "@storybook/react";



const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider >
        <Story />
      </ChakraProvider>
	)
  ]
};

export default preview;