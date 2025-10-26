import React from "react";
import mail from "./mail-big.svg";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
// import ResendButton from './ResendButton'

export default async function VerifyAccountPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const t = await getTranslations("Auth.verify");
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
            "font-normal max-w-[530px] text-[1.8rem] leading-[25px] text-center text-neutral-700"
          }
        >
          {t("description")}{" "}
          <span className="font-semibold">{decodeURIComponent(email)}</span>
        </p>
        <Link
          href={"/auth/register"}
          className={
            "font-normal max-w-[530px] text-[1.4rem] leading-[25px] text-center text-primary-500"
          }
        >
          {t("wrong")}
        </Link>
      </div>
      {/* <div
        className={
          'flex items-center gap-[1.8rem] border border-neutral-100 p-4 rounded-[10rem] mb-8'
        }
      >
        <span
          className={'font-normal text-[1.8rem] leading-[25px] text-center text-neutral-700'}
        >
          {t('footer.text')}
        </span>
        <ResendButton email={decodeURIComponent(email)}/>
        
      </div> */}
    </div>
  );
}
