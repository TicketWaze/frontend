import React from "react";
import OnboardingLogic from "./OnboardingLogic";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { getLocale } from "next-intl/server";

export default async function OnboardingPage() {
  const session = await auth();
  const locale = await getLocale();
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/onboarding`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
        "Accept-Language": locale,
        Origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
      },
    }
  );
  const response = await request.json();
  const responseType: "invite" | "login" = response.type;
  const user = response.user;
  const organisations = response.organisations;
  console.log(response);
  return (
    <>
      <OnboardingLogic
        responseType={responseType}
        user={user}
        organisations={organisations}
      />
    </>
  );
}
