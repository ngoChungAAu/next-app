import { ComponentStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const ButtonStyle: ComponentStyleConfig = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: "teal.500",
      color: "white",
      _hover: {
        bg: "teal.300",
      },
    },
    secondary: (props) => ({
      bg: mode("green.500", "red.500")(props),
      color: "white",
      _hover: {
        bg: mode("green.700", "red.700")(props),
      },
    }),
  },
  // default values for `size` and `variant`
  defaultProps: {
    size: "",
    variant: "",
  },
};
