import NextAuth from "next-auth";
import { User, Organisation } from "@workspace/typescript-config";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  //   interface User extends User {} // ensures your custom User type is applied

  interface JWT {
    user: User;
  }
}
