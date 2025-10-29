import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import BackButton from "@workspace/ui/components/BackButton";
import TopBar from "@workspace/ui/components/TopBar";
import { getTranslations } from "next-intl/server";
import React from "react";
import ToggleIcon from "@workspace/ui/components/ToggleIcon";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function Page() {
  const t = await getTranslations("Settings.security");
  return (
    <OrganizerLayout title={t("title")}>
      <div className="flex flex-col gap-8">
        <BackButton text={t("back")} />
        <TopBar title={t("title")} />
      </div>

      {/*</OrganizerTopbar>*/}
      <div
        className={
          "flex flex-col overflow-y-scroll overflow-x-hidden gap-[40px] w-full lg:w-[530px] mx-auto"
        }
      >
        {/*  personal information*/}
        <ChangePasswordForm />

        <div className="flex flex-col gap-8 w-full">
          <span
            className={"font-medium text-[1.8rem] leading-[25px] text-deep-100"}
          >
            {t("two_factor")}
          </span>
          <div className={"flex items-center justify-between"}>
            <p
              className={
                "text-[1.6rem] leading-[22px] text-deep-100 max-w-[380px]"
              }
            >
              {t("enable")}
            </p>
            <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
              <input className="peer sr-only" id="2fa" type="checkbox" />
              <ToggleIcon />
            </label>
          </div>
        </div>
        <div></div>
      </div>
    </OrganizerLayout>
  );
}
