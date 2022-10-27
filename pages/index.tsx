import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

export default function Home() {
  return <Layout>demo app</Layout>;
}

Home.auth = true;
