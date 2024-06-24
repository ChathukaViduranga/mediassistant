import { NextAuthOptions, CallbacksOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleID = process.env.GOOGLE_CLIENT_ID!;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: googleID,
      clientSecret: googleSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (
        user.email == "chathuka.viduranga.bc@gmail.com" ||
        user.email == "roshansamarathunga27@gmail.com" ||
        user.email == "janudkumarasinghe@gmail.com"
      ) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
};
