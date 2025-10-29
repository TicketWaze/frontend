"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Verify } from "iconsax-react";
import { useTranslations } from "next-intl";

function VerifiedOrganisationCheckMark() {
  const t = useTranslations("Layout.sidebar");
  return (
    <Tooltip>
      <TooltipTrigger asChild className="inline-block">
        <Verify size="24" variant={"Bulk"} color="#E45B00" />
      </TooltipTrigger>
      <TooltipContent>
        <p className={"font-primary text-[1.4rem]"}>{t("verified")}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default VerifiedOrganisationCheckMark;
