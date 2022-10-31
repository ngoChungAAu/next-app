import { Container, Grid, GridItem } from "@chakra-ui/react";
import React, { ReactElement, ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
  type?: "left" | "right";
}

export default function Layout(props: Props) {
  const styleLayout = props.type
    ? props.type === "left"
      ? `"nav main"`
      : `"main nav"`
    : `"main main"`;

  const sizeLayout = props.type
    ? props.type === "left"
      ? "300px 1fr"
      : "1fr 300px"
    : "";

  return (
    <Grid
      templateAreas={`"header header" ${styleLayout}`}
      templateColumns={sizeLayout}
    >
      <GridItem area={"header"}>
        <Header />
      </GridItem>
      {props.type && (
        <GridItem mt="3" area={"nav"}>
          <Sidebar />
        </GridItem>
      )}
      <GridItem mt="3" area={"main"}>
        {props.children}
      </GridItem>
    </Grid>
  );
}
