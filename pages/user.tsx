import {
  Button,
  Container,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
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

const User: CustomNextPage = (props) => {
  const { data } = useQuery(["users"], getUsers);

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
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
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

export default User;

User.auth = {
  schema: (query) => ({
    canVisit: query.readAny("user"),
  }),
};
