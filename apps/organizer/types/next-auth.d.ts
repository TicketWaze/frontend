import NextAuth from "next-auth";
import User from "./User";
import Organisation from "./Organisation";

declare module "next-auth" {
  interface Session {
    user: User;
    activeOrganisation: Organisation;
  }

//   interface User extends User {} // ensures your custom User type is applied

  interface JWT {
    user: User;
    activeOrganisation: Organisation;
  }
}
