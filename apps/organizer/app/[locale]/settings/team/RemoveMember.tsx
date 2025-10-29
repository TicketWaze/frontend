"use client";
import { RemoveMemberQuery } from "@/actions/organisationActions";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function RemoveMember({ email }: { email: string }) {
  const t = useTranslations("Settings.team");
  const { data: session } = useSession();
  const organisation = session?.activeOrganisation;
  const locale = useLocale();
  const [origin, setOrigin] = useState("");
  useEffect(function () {
    const origin = window.location.origin;
    setOrigin(origin);
  }, []);
  const CloseDialogRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <DialogContent className={"w-[360px] lg:w-[520px] "}>
      <DialogHeader>
        <DialogTitle
          className={
            "font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary"
          }
        >
          {t("remove")}
        </DialogTitle>
        <DialogDescription className={"sr-only"}>
          <span>Remove Member</span>
        </DialogDescription>
      </DialogHeader>
      <div
        className={
          "flex flex-col w-auto justify-center items-center pt-[25px] gap-[30px]"
        }
      >
        <p className={"text-[1.8rem] text-center leading-[25px] text-gray-400"}>
          {t("confirm_text")}
        </p>
      </div>

      <DialogFooter>
        <span
          onClick={async () => {
            setIsLoading(true);
            const result = await RemoveMemberQuery(
              organisation?.organisationId ?? "",
              session?.user.accessToken ?? "",
              email,
              locale,
              origin
            );
            if (result.status === "success") {
              toast.success("Member Revoked");
            } else {
              toast.error(result.error);
            }
            setIsLoading(false);
            CloseDialogRef.current?.click();
          }}
          className={
            "border-failure text-failure bg-[#FCE5EA] px-[3rem] py-[15px] border-2 rounded-[100px] text-center  font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center w-full mt-12"
          }
        >
          {isLoading ? <LoadingCircleSmall /> : t("confirm")}
        </span>
        <DialogClose className="w-full sr-only ">
          <span ref={CloseDialogRef}>close</span>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
