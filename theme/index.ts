import { foundations } from "./foundations";
import { components } from "./components";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { styles } from "./styles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  ...foundations,
  components,
  styles,
});

export default theme;
