"use client";
import { ShieldSecurity } from "iconsax-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function UnauthorizedView() {
  const t = useTranslations("Layout");
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-[50px]">
        <div className="w-[120px] h-[120px] bg-neutral-100 rounded-full flex items-center justify-center">
          <div className="w-[90px] h-[90px] bg-neutral-200 rounded-full flex items-center justify-center">
            <ShieldSecurity size="50" color="#0D0D0D" variant="Bulk" />
          </div>
        </div>
        <p className="text-[1.8rem] leading-8 text-neutral-600 text-center max-w-[500px]">
          {t("noAccess")}
        </p>
      </div>
    </div>
  );
}
