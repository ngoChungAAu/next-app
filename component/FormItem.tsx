import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";

type Props = FormControlProps & {
  label: React.ReactNode;
  helperText?: React.ReactNode;
};

const FormItem = ({
  children,
  label,
  helperText,
  ...formControlProps
}: Props) => {
  return (
    <FormControl {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormItem;
