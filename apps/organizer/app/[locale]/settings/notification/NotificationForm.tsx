"use client";
import { UpdateOrganisationNotificationPreferences } from "@/actions/organisationActions";
import { NotificationPreference } from "@workspace/typescript-config";
import ToggleIcon from "@workspace/ui/components/ToggleIcon";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

export default function NotificationForm({
  notificationPreferences,
}: {
  notificationPreferences: NotificationPreference;
}) {
  const t = useTranslations("Settings.notification");
  // const organisation = useStore(organisationStore, organisationStore => organisationStore.state.organisation)
  const { data: session } = useSession();
  const organisation = session?.activeOrganisation;
  async function changeHandler(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const emailTicketSalesUpdate =
      formData.get("emailTicketSalesUpdate") === "on";
    const emailPaymentUpdates = formData.get("emailPaymentUpdates") === "on";
    const emailPlatformAnnouncements =
      formData.get("emailPlatformAnnouncements") === "on";

    const body = {
      emailTicketSalesUpdate,
      emailPaymentUpdates,
      emailPlatformAnnouncements,
    };

    const result = await UpdateOrganisationNotificationPreferences(
      organisation?.organisationId ?? "",
      body,
      session?.user.accessToken ?? ""
    );

    if (result.error) {
      toast.error(result.error);
    }
  }
  return (
    <div
      className={
        "flex flex-col overflow-y-scroll gap-[40px] w-full h-[70dvh] lg:w-[530px] mx-auto"
      }
    >
      <form onChange={changeHandler} className={"flex flex-col gap-8"}>
        <span
          className={
            "font-medium text-[1.8rem] pb-4 leading-[25px] text-deep-100"
          }
        >
          {t("email")}
        </span>
        <div className={"flex items-center justify-between"}>
          <p
            className={
              "text-[1.6rem] leading-[22px] text-deep-100 max-w-[280px] lg:max-w-[380px]"
            }
          >
            {t("ticket_sales")}
          </p>
          <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
            <input
              className="peer sr-only"
              id="emailTicketSalesUpdate"
              defaultChecked={notificationPreferences.emailTicketSalesUpdate}
              name={"emailTicketSalesUpdate"}
              type="checkbox"
            />
            <ToggleIcon />
          </label>
        </div>
        <div className={"h-[1px] w-full bg-neutral-100"}></div>
        <div className={"flex items-center justify-between"}>
          <p
            className={
              "text-[1.6rem] leading-[22px] text-deep-100 max-w-[280px] lg:max-w-[380px]"
            }
          >
            {t("payment_update")}
          </p>
          <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
            <input
              className="peer sr-only"
              id="emailPaymentUpdates"
              defaultChecked={notificationPreferences.emailPaymentUpdates}
              name={"emailPaymentUpdates"}
              type="checkbox"
            />
            <ToggleIcon />
          </label>
        </div>
        <div className={"h-[1px] w-full bg-neutral-100"}></div>
        <div className={"flex items-center justify-between"}>
          <p
            className={
              "text-[1.6rem] leading-[22px] text-deep-100 max-w-[280px] lg:max-w-[380px]"
            }
          >
            {t("platform")}
          </p>
          <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
            <input
              className="peer sr-only"
              id="emailPlatformAnnouncements"
              defaultChecked={
                notificationPreferences.emailPlatformAnnouncements
              }
              name={"emailPlatformAnnouncements"}
              type="checkbox"
            />
            <ToggleIcon />
          </label>
        </div>
      </form>
    </div>
  );
}
