"use client";
import React, { useState } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { useLocale, useTranslations } from "next-intl";
import Separator from "@/components/Separator";
import { usePathname } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { UpdateUserPreferences } from "@/actions/userActions";
import { UserPreference } from "@workspace/typescript-config";
import { toast } from "sonner";
import PageLoader from "@/components/Loaders/PageLoader";

export default function AppLanguage({
  userPreferences,
}: {
  userPreferences: UserPreference;
}) {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  async function switchLanguagePreference(appLanguage: string) {
    setIsLoading(true);
    const response = await UpdateUserPreferences(
      session?.user.accessToken ?? "",
      {
        ...userPreferences,
        appLanguage,
      },
      locale
    );
    if (response.status !== "success") {
      toast.error(response.message);
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/${appLanguage}${pathname}`;
    }
    setIsLoading(false);
  }
  return (
    <div className="flex flex-col gap-6">
      <PageLoader isLoading={isLoading} />
      <span className="font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100">
        {t("language.title")}
      </span>
      <RadioGroup className="flex flex-col gap-6" defaultValue={locale}>
        <div
          onClick={() => switchLanguagePreference("en")}
          className="flex items-center justify-between gap-3"
        >
          <span className="text-[1.6rem] text-deep-100">English</span>
          <RadioGroupItem value={"en"} />
        </div>
        <Separator />
        <div
          onClick={() => switchLanguagePreference("fr")}
          className="flex items-center justify-between gap-3"
        >
          <span className="text-[1.6rem] text-deep-100">Français</span>
          <RadioGroupItem value={"fr"} />
        </div>
      </RadioGroup>
    </div>
  );
}
