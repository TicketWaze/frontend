"use client";
import { UpdateOrganisationPaymentInformation } from "@/actions/organisationActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@workspace/ui/components/Inputs";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function PaymentInformationsForm() {
  const t = useTranslations("Settings.payment");
  const { data: session } = useSession();
  const organisation = session?.activeOrganisation;

  const PaymentDetailsSchema = z.object({
    bankName: z.string().min(1, t("errors.bank_name")),
    bankAccountName: z.string().min(1, t("errors.bank_account_name")),
    bankAccountNumber: z.string().min(1, t("errors.bank_name")),
  });
  type TPaymentDetailsSchema = z.infer<typeof PaymentDetailsSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TPaymentDetailsSchema>({
    resolver: zodResolver(PaymentDetailsSchema),
    values: {
      bankAccountName: organisation?.bankAccountName ?? "",
      bankAccountNumber: organisation?.bankAccountNumber ?? "",
      bankName: organisation?.bankName ?? "",
    },
  });

  async function submitHandler(data: TPaymentDetailsSchema) {
    const result = await UpdateOrganisationPaymentInformation(
      organisation?.organisationId ?? "",
      data.bankName,
      data.bankAccountName,
      data.bankAccountNumber,
      session?.user.accessToken ?? ""
    );

    if (result.status === "success") {
      toast.success("Success");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div
      className={
        "flex flex-col overflow-y-scroll gap-[40px] w-full h-full  lg:w-[530px] mx-auto"
      }
    >
      <form
        id="payment-form"
        onSubmit={handleSubmit(submitHandler)}
        className={"flex h-[70vh] flex-col gap-8"}
      >
        <span
          className={
            "pb-4 font-medium text-[1.8rem] leading-[25px] text-deep-100"
          }
        >
          {t("subtitle")}
        </span>

        <div
          className={
            "border border-neutral-100 rounded-[10px] p-[15px] flex flex-col gap-[15px]"
          }
        >
          <span
            className={"font-semibold text-[16px] leading-[22px] text-deep-100"}
          >
            {t("bank")}
          </span>
          <Input
            {...register("bankName")}
            type="text"
            disabled={isSubmitting}
            error={errors.bankName?.message}
          >
            {t("bank_name")}
          </Input>
          <Input
            {...register("bankAccountName")}
            type="text"
            disabled={isSubmitting}
            error={errors.bankAccountName?.message}
          >
            {t("bank_account_name")}
          </Input>
          <Input
            {...register("bankAccountNumber")}
            type="text"
            disabled={isSubmitting}
            error={errors.bankAccountNumber?.message}
          >
            {t("bank_account_number")}
          </Input>
        </div>
      </form>
    </div>
  );
}
