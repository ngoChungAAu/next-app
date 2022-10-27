import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";

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

        //call api login here

        // Add logic here to look up the user from the credentials supplied
        const user = {
          id: "1",
          name: "J Smith",
          email: "jsmith@example.com",
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      return token;
    },

    async session({ session, token }: any) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
