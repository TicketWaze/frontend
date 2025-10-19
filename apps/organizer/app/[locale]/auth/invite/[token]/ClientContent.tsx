"use client";
import { useRouter } from "@/i18n/navigation";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { InfoCircle } from "iconsax-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClientContent({
  token,
  accessToken,
}: {
  token: string;
  accessToken: string;
}) {
  const router = useRouter();
  const [error, setError] = useState();
  const t = useTranslations("Auth.register");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/invite/accept/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        if (res.status !== "success") {
          toast.error(res.message);
          setError(res.message);
        } else {
          toast.success("Success");
          setTimeout(() => {
            router.push("/analytics");
          }, 2000);
        }
      });
  }, []);
  return (
    <>
      {error ? (
        <div className="flex flex-col items-center gap-12">
          <InfoCircle size="80" color="#737C8A" variant="Bulk" />
          <p className="text-[1.8rem] text-center leading-8 text-neutral-700">
            {t("invalidToken")}
          </p>
          <ButtonPrimary onClick={() => router.push("/auth/login")}>
            {t("login")}
          </ButtonPrimary>
        </div>
      ) : (
        <LoadingCircleSmall />
      )}
    </>
  );
}
