import React, { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  FormLabel,
  FormControl,
  Select,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink, { LinkProps } from "next/link";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useLanguageContext } from "../../context";

const NavLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: LinkProps["href"];
}) => {
  return (
    <NextLink href={href} legacyBehavior>
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {children}
      </Link>
    </NextLink>
  );
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const { t } = useTranslation("common");
  const [settings, changeSetting] = useLanguageContext();

  const Links = ["post", "user"];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleChangeLanguage = () => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: router.locale === "vi" ? "en" : "vi",
    });
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link} href={link.toLowerCase()}>
                  {t(`navbar.${link}`)}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} gap={5}>
            <HStack>
              <Text color="blue" whiteSpace={"nowrap"}>
                Date time format
              </Text>
              <Select
                placeholder="Select format"
                onChange={(e) =>
                  changeSetting({ key: "datetime", lng: e.target.value })
                }
                value={settings.datetime}
              >
                <option value="en">English</option>
                <option value="vi">Vietnam</option>
              </Select>
            </HStack>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
                <MenuItem onClick={handleChangeLanguage}>
                  {t("changeLocale", {
                    changeTo: router.locale === "en" ? "vi" : "en",
                  })}
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} href={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
}
