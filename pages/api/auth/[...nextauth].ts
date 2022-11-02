import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";
import Cookies from "cookies";
import { signOut } from "next-auth/react";

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

async function refreshAccessToken(tokenObject: any) {
  const { accessToken, refreshToken } = tokenObject.user;

  try {
    // Get a new set of tokens with a refreshToken
    const res = await axios.post(
      `${process.env.BASE_URL}/user/refresh-token`,
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    return {
      ...tokenObject,
      user: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expireIn: res.data.expAccessToken * 1000,
        ...tokenObject.user,
      },
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

async function getProfile(tokenObject: any) {
  const { accessToken } = tokenObject.user;

  try {
    // Get a new set of tokens with a refreshToken
    const res = await axios.get(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    return {
      ...tokenObject,
      user: {
        id: res.data._id,
        role: res.data.role,
        ...tokenObject.user,
      },
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const nextAuthOptions: NextAuthOptionsCallback = (req, res) => {
  const cookies = new Cookies(req, res);

  return {
    providers: [
      CredentialsProvider({
        type: "credentials",
        credentials: {},
        async authorize(credentials) {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const response = await axios.post(
            `${process.env.BASE_URL}/auth/login`,
            {
              email,
              password,
            },
            {
              withCredentials: true,
            }
          );

          cookies.set("NEXT_LOCALE", "vi");

          if (!!response.data) {
            return response.data;
          } else {
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: any) {
        if (!!user) {
          const {
            accessToken,
            refreshToken,
            permissions,
            expAccessToken,
            ...data
          } = user;

          return {
            ...token,
            user: {
              id: data.user._id,
              permissions,
              accessToken,
              refreshToken,
              role: data.user.role,
              expireIn: expAccessToken * 1000,
            },
          };
        }

        // refresh before expire in 10 mins
        const shouldRefreshTime = Math.round(
          token.user.expireIn - 10 * 60 * 1000 - Date.now()
        );

        // If the token is still valid, just return it.
        if (shouldRefreshTime > 0) {
          if (token.user.accessToken) {
            return getProfile(token);
          } else return token;
        }

        // Access token has expired, try to update it
        return refreshAccessToken(token);
      },

      async session({ session, token }: any) {
        session.user = token.user;

        return session;
      },
    },
    events: {
      async signOut() {
        console.log("logout");
      },
    },
    pages: {
      signIn: "/login",
    },
  };
};

declare module "next-auth" {
  export interface User {
    [P: string]: any;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, nextAuthOptions(req, res));
