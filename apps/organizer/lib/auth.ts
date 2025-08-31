import Organisation from "@/types/Organisation";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const nextAuthResult = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  jwt: {
    maxAge: 2 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        })
        const user = await response.json()
        if (!user.status || user.status != 'success') {
          throw new Error(user.message)
        }
        return user.user
      },
    }),

  ],
  pages: {
    signIn: `/auth/login`,
    error: `/auth/login`
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in
      if (user) {
        const customUser = user as unknown as import("@/types/User").default;
        token = { ...token, ...customUser };
        token.activeOrganisation = customUser.organisations?.[0] ?? null;
      }

      // Manual update (client calls `update()`)
      if (trigger === "update" && session?.activeOrganisation) {
        token.activeOrganisation = session.activeOrganisation;
      }

      return token;
    },
    async session({ session, token }) {
      // copy token into session
      session.user = token as any;
      session.activeOrganisation = (token as any).activeOrganisation ?? null;
      return session;
    },
  },
},);

export const handlers: typeof nextAuthResult.handlers = nextAuthResult.handlers;
export const signIn: typeof nextAuthResult.signIn = nextAuthResult.signIn;
export const signOut: typeof nextAuthResult.signOut = nextAuthResult.signOut;
export const auth: typeof nextAuthResult.auth = nextAuthResult.auth;