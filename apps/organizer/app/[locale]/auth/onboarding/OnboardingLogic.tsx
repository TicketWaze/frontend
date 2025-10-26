"use client";
import PageLoader from "@/components/Loaders/PageLoader";
import { useRouter } from "@/i18n/navigation";
import Organisation from "@/types/Organisation";
import User from "@/types/User";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OnboardingLogic({
  responseType,
  user,
  organisations,
}: {
  responseType: "invite" | "login";
  user: User;
  organisations: Organisation[];
}) {
  const t = useTranslations("Auth.onboarding");
  const [invitedOrganisations, setInvitedOrganisation] = useState<
    Organisation[] | undefined
  >();
  const { data: session, update } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    const handleOnboarding = async () => {
      if (responseType === "invite") {
        setInvitedOrganisation(organisations);
      } else {
        if (user?.organisations?.[0]?.organisationId) {
          try {
            await update({
              activeOrganisation: user.organisations[0],
            });
            router.push(
              `/analytics?organisationId=${user.organisations[0].organisationId}`
            );
          } catch (error) {
            console.error("Failed to update session:", error);
            toast.error("Failed to load organisation");
          }
        } else {
          console.error("No organisation found for user");
          toast.error("No organisation found");
        }
      }
    };
    handleOnboarding();
  }, []);

  async function JoinOrganisation(organisation: Organisation) {
    setIsloading(true);
    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/invite/${organisation.organisationId}`,
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
      const res = await req.json();
      if (res.status === "success") {
        await update({
          activeOrganisation: organisation,
        });
        router.push(`/analytics?organisationId=${organisation.organisationId}`);
      }
    } catch (error) {
      console.error("Failed to join organisation:", error);
      toast.error("Failed to Join Organisation");
    }
    setIsloading(false);
  }

  return (
    <div
      className={`h-full flex flex-col items-center ${!invitedOrganisations && "justify-center"} w-full `}
    >
      <PageLoader isLoading={isLoading} />
      {invitedOrganisations ? (
        <div className=" flex flex-col gap-[80px] pt-[40px] w-full">
          <div className="flex flex-col gap-8 items-center">
            <h3 className="font-medium font-primary text-[3.2rem] leading-[3.5rem] text-black">
              {t("title")}
            </h3>
            <p className="text-[1.8rem] text-center leading-[2.5rem] text-neutral-700">
              {t("description")}
            </p>
          </div>
          {invitedOrganisations.map((organisation) => {
            return (
              <div
                key={organisation.organisationId}
                className="flex items-center justify-between gap-3 bg-neutral-100 px-6 py-8 rounded-[15px] w-full"
              >
                <div className="flex items-center gap-4">
                  {organisation?.profileImageUrl ? (
                    <Image
                      src={organisation.profileImageUrl}
                      width={35}
                      height={35}
                      alt={organisation.organisationName}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="w-[35px] h-[35px] flex items-center justify-center bg-black rounded-full text-white uppercase font-medium text-[2.2rem] leading-[30px] font-primary">
                      {organisation?.organisationName.slice()[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="text-[1.6rem]">
                    {organisation.organisationName}
                  </span>
                </div>
                <ButtonPrimary
                  disabled={isLoading}
                  onClick={() => JoinOrganisation(organisation)}
                >
                  {isLoading ? <LoadingCircleSmall /> : t("join")}
                </ButtonPrimary>
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingCircleSmall />
      )}
    </div>
  );
}
