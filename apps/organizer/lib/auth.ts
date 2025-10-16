import Organisation from "@/types/Organisation";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        accessToken: {},
      },
      authorize: async (credentials) => {
        try {
          // console.log(credentials.accessToken);

          if (credentials.accessToken) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${credentials.accessToken}`,
                },
              }
            );

            if (!response.ok) {
              // console.error('Failed to fetch user:', response.status)
              return null;
            }

            const data = await response.json();

            if (!data.status || data.status !== "success") {
              // console.error('User fetch failed:', data.message)
              return null;
            }

            // Make sure to return a valid user object with at least an id
            const user = data.user || data;
            // console.log('User from accessToken:', user) // Debug log
            return user;
          } else {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: credentials.email,
                  password: credentials.password,
                }),
              }
            );

            if (!response.ok) {
              // console.error('Login failed:', response.status)
              return null;
            }

            const data = await response.json();

            if (!data.status || data.status !== "success") {
              // console.error('Login failed:', data.message)
              return null;
            }

            console.log("User from login:", data.user); // Debug log
            return data.user;
          }
        } catch (error) {
          // console.error('Authorize error:', error)
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: `/auth/login`,
    error: `/auth/login`,
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
    redirect({ url, baseUrl }) {
      return url;
    },
  },
});

export const handlers: typeof nextAuthResult.handlers = nextAuthResult.handlers;
export const signIn: typeof nextAuthResult.signIn = nextAuthResult.signIn;
export const signOut: typeof nextAuthResult.signOut = nextAuthResult.signOut;
export const auth: typeof nextAuthResult.auth = nextAuthResult.auth;
