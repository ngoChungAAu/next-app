import { foundations } from "./foundations";
import { components } from "./components";
import { type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = {
  config,
  ...foundations,
  components,
};

export default theme;
