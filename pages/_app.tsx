import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import theme from "../theme";
import { useEffect } from "react";
import RefreshTokenHandler from "../component/RefreshTokenHandler";

export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  withLayout?: (page: ReactElement) => ReactNode;
  auth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: CustomNextPage;
};

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  const withLayout = Component.withLayout ?? ((page: any) => page);

  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider session={session} refetchInterval={interval}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          {Component.auth ? (
            <Auth>{withLayout(<Component {...pageProps} />)}</Auth>
          ) : (
            withLayout(<Component {...pageProps} />)
          )}
        </ChakraProvider>
      </QueryClientProvider>
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}

function Auth({ children }: any) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }

    if (status === "loading") return;

    if (!isUser) signIn();
  }, [isUser, status, session]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}
