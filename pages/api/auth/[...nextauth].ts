import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";

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
      },
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const res = await axios.post(`${process.env.BASE_URL}/auth/login`, {
          email,
          password,
        });

        if (!!res.data) {
          return res.data;
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
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }: any) {
      session.user = token.user;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

declare module "next-auth" {
  export interface User {
    [P: string]: any;
  }
}

export default NextAuth(authOptions);
