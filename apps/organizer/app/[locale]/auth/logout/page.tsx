"use client";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { signOut } from "next-auth/react";

export default function SignoutPage() {
  signOut({
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_APP_URL,
  });
  <div className="h-full flex items-center justify-center">
    <LoadingCircleSmall />
  </div>;
}
