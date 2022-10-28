import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import axios from "axios";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
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
        const { accessToken, refreshToken, permissions, ...data } = user;
        return {
          ...token,
          user: {
            id: data.user._id,
            accessToken,
            refreshToken,
          },
        };
      }

      return token;
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

export default NextAuth(authOptions);
