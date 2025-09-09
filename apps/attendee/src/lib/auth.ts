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
  trustHost: true,
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
    async jwt({ token, user }) {
      if (user) {
        // first login
        return { ...token, ...user }
      }
      return token;
    },
    async session({ session, token }) {
      // copy token into session
      session.user = token as any;
      return session;
    },
    redirect({url, baseUrl}){
      return url
    }
  },
},);

export const handlers: typeof nextAuthResult.handlers = nextAuthResult.handlers;
export const signIn: typeof nextAuthResult.signIn = nextAuthResult.signIn;
export const signOut: typeof nextAuthResult.signOut = nextAuthResult.signOut;
export const auth: typeof nextAuthResult.auth = nextAuthResult.auth;