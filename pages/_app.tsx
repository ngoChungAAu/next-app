import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  withLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: CustomNextPage;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const withLayout = Component.withLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {withLayout(<Component {...pageProps} />)}
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
