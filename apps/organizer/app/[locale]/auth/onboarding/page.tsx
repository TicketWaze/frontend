import React from "react";
import OnboardingLogic from "./OnboardingLogic";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export default async function OnboardingPage() {
  const session = await auth();
  return (
    <>
      <OnboardingLogic session={session as Session} />
    </>
  );
}
