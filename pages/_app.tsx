import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactElement, ReactNode, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import theme from "../theme";
import { useEffect } from "react";
import { AccessControl } from "accesscontrol";
import { CHECK_FUNCTION_MAP, Relation, Schema } from "../utils";
import Redirect from "../component/Redirect";
import RefreshTokenHandler from "../component/RefreshTokenHandler";
import { appWithTranslation } from "next-i18next";
import Layout from "../component/Layout";
import { useTranslation } from "next-i18next";

export type CustomNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (pageProps: AppProps, page: ReactElement) => ReactNode;
  auth?: {
    schema?: Schema;
    relation?: Relation;
  };
};

type AppPropsWithLayout = AppProps & {
  Component: CustomNextPage;
};

const queryClient = new QueryClient();

function App({
  Component: OrginalComponent,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const Component = OrginalComponent.auth
    ? Auth(OrginalComponent)
    : OrginalComponent;

  const [interval, setInterval] = useState(0);

  return (
    <SessionProvider session={session} refetchInterval={interval}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}

export default appWithTranslation(App);

function Auth(Component: CustomNextPage) {
  return function ComponentWithAuth(props: any) {
    const { data: session, status } = useSession();
    const { t } = useTranslation("common");
    // @ts-ignored
    const permissions = session?.user?.permissions?.[0];
    // @ts-ignored
    const accessToken = session?.user?.accessToken;

    useEffect(() => {
      if (session?.error === "RefreshAccessTokenError") {
        signOut({ callbackUrl: "/login" });
      }

      if (status === "loading") return;

      if (status === "unauthenticated") signIn();
    }, [status, session]);

    const acQuery = useMemo(() => {
      if (permissions) {
        const ac = new AccessControl(permissions || []);
        return ac.can(Object.keys(permissions));
      }

      return null;
    }, [permissions]);

    const permissionsList = acQuery ? Component.auth?.schema?.(acQuery) : {};
    const grant = permissionsList
      ? CHECK_FUNCTION_MAP[Component.auth?.relation || "or"](permissionsList)
      : true;

    useEffect(() => {
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      } else {
        localStorage.removeItem("token");
      }
    }, [accessToken]);

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
      return <Redirect to="/login" />;
    }

    if (!grant) {
      return <Layout>{t("accessDenied")}</Layout>;
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <Component {...{ ...props, permissionsList }} />;
  };
}

declare global {
  interface Window {
    query: ReturnType<InstanceType<typeof AccessControl>["can"]>;
  }
}
