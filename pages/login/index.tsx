import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("login");
  const handleShowClick = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        mb="2"
        p="25px 15px"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        border="1px solid #319795"
        borderRadius="10px"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">{t("title")}</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <Stack spacing={4} p="1rem" boxShadow="md">
            <FormControl>
              <InputGroup>
                <Input
                  type="Email"
                  placeholder={t("input.email.placeholder")}
                  height="50px"
                  _placeholder={{ color: "gray.600" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("input.password.placeholder")}
                  height="50px"
                  _placeholder={{ color: "gray.600" }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" mt="5px">
                  <Button onClick={handleShowClick}>
                    {showPassword
                      ? t("input.password.hide")
                      : t("input.password.show")}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              variant="primary"
              width="full"
              height="50px"
              onClick={handleLogin}
            >
              {t("login")}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["login", "common"])),
      // Will be passed to the page component as props
    },
  };
}
