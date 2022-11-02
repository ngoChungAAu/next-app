import {
  Container,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";
import Layout from "../component/Layout";
import { getUsers } from "../services";
import { CustomNextPage } from "./_app";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const User: CustomNextPage = (props) => {
  const { data } = useQuery(["users"], getUsers);
  const { t } = useTranslation("user");
  const users = data?.items || [];
  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <Layout>
        <Container maxW="container.xl">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("table.title.name")}</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user._id}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["user", "common"])),
      // Will be passed to the page component as props
    },
  };
}

export default User;

User.auth = {
  schema: (query) => ({
    canVisit: query.readAny("user"),
  }),
};
