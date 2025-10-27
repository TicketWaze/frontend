import { getTranslations } from "next-intl/server";
import React from "react";
import mail from "./mail-big.svg";
import Image from "next/image";
import ResendButton from "./ResendButton";

export default async function ResetMailSentPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const t = await getTranslations("Auth.email_sent");
  return (
    <div
      className={
        " flex flex-col gap-16 items-center justify-center h-dvh lg:h-full"
      }
    >
      <Image src={mail} alt={"email icon"} />
      <div className={"flex flex-col gap-8 items-center"}>
        <h2
          className={
            "font-medium font-primary text-[3.2rem] leading-[35px] text-center text-black"
          }
        >
          {t("title")}
        </h2>
        <p
          className={
            "font-normal text-[1.8rem] leading-[25px] text-center text-neutral-700"
          }
        >
          {t("description")}{" "}
          <span className={"font-bold"}>{decodeURIComponent(email)}</span>
        </p>
      </div>
      {/* <ResendButton email={decodeURIComponent(email)}/> */}
    </div>
  );
}
