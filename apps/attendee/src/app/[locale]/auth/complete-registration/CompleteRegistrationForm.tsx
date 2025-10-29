"use client";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import { Input } from "@workspace/ui/components/Inputs";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Country } from "@workspace/typescript-config";

export default function CompleteRegistrationForm({
  accessToken,
  email,
  password,
  countries,
}: {
  accessToken: string;
  email: string;
  password: string;
  countries: Country[];
}) {
  const t = useTranslations("Auth.complete");
  const CompleteRegistrationSchema = z.object({
    country: z.string({ error: t("placeholders.errors.country") }),
    city: z.string().min(1, { error: t("placeholders.errors.city") }),
    state: z.string().min(1, { error: t("placeholders.errors.state") }),
    dateOfBirth: z.string().min(1, { error: t("placeholders.errors.dob") }),
    gender: z.string({ error: t("placeholders.errors.gender") }),
    phoneNumber: z.string().min(8, { error: t("placeholders.errors.phone") }),
    // currencyId: z.string({ error: t("placeholders.errors.currency") }),
  });
  type TCompleteRegistrationSchema = z.infer<typeof CompleteRegistrationSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TCompleteRegistrationSchema>({
    resolver: zodResolver(CompleteRegistrationSchema),
  });
  const locale = useLocale();
  const router = useRouter();
  async function submitHandler(data: TCompleteRegistrationSchema) {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/complete-registration/${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
          Origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await request.json();
    if (response.status === "success") {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      });
      if (result?.error) {
        toast.error("Login failed");
      } else {
        router.push("/explore");
      }
    } else {
      toast(response.message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col items-center justify-between gap-20 w-full h-full pb-4 "
    >
      <div className={"flex flex-col gap-16 w-full"}>
        <div className="flex-1 flex lg:justify-center flex-col w-full pt-[4.5rem]">
          <div className="flex flex-col gap-16 items-center">
            <div className="flex flex-col gap-8 items-center">
              <h3 className="font-medium font-primary text-center text-[3.2rem] leading-[3.5rem] text-black">
                {t("title")}
              </h3>
              <p className="text-[1.8rem] text-center leading-[2.5rem] text-neutral-700">
                {t("description")}
              </p>
            </div>
            <div className=" w-full flex flex-col gap-6">
              <div>
                <Select onValueChange={(e) => setValue("country", e)}>
                  <SelectTrigger className="bg-neutral-100 cursor-pointer rounded-[3rem] px-8 border-none w-full py-12 text-[1.4rem] text-neutral-700 leading-[20px]">
                    <SelectValue placeholder={t("placeholders.country")} />
                  </SelectTrigger>
                  <SelectContent className={"bg-neutral-100 text-[1.4rem]"}>
                    <SelectGroup>
                      {countries &&
                        countries?.map((country, i) => {
                          return (
                            <SelectItem
                              className={"text-[1.4rem] text-deep-100"}
                              key={i}
                              value={country.name.common}
                            >
                              {country.name.common}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.country.message}
                  </span>
                )}
              </div>
              <div className={"flex gap-[1.5rem]"}>
                <Input
                  {...register("state")}
                  type="text"
                  error={errors.state?.message}
                >
                  {t("placeholders.state")}
                </Input>
                <Input
                  {...register("city")}
                  type="text"
                  error={errors.city?.message}
                >
                  {t("placeholders.city")}
                </Input>
              </div>
              <div>
                <div
                  className={
                    "bg-neutral-100 w-full rounded-[5rem] py-4 px-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500"
                  }
                >
                  <span className={"text-neutral-600 text-[1.2rem]"}>
                    {t("placeholders.dob")}
                  </span>
                  <input
                    type={"date"}
                    className={"w-full outline-none"}
                    {...register("dateOfBirth")}
                  />
                </div>
                {errors.dateOfBirth && (
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>
              <Input
                {...register("phoneNumber")}
                type="text"
                error={errors.phoneNumber?.message}
              >
                {t("placeholders.phone")}
              </Input>
              <div>
                <Select onValueChange={(e) => setValue("gender", e)}>
                  <SelectTrigger className="bg-neutral-100 cursor-pointer rounded-[3rem] px-8 border-none w-full py-12 text-[1.4rem] text-neutral-700 leading-[20px]">
                    <SelectValue placeholder={t("placeholders.gender")} />
                  </SelectTrigger>
                  <SelectContent className={"bg-neutral-100 text-[1.4rem]"}>
                    <SelectGroup>
                      <SelectItem
                        className={"text-[1.4rem] text-deep-100"}
                        value={"male"}
                      >
                        {t("placeholders.male")}
                      </SelectItem>
                      <SelectItem
                        className={"text-[1.4rem] text-deep-100"}
                        value={"female"}
                      >
                        {t("placeholders.female")}
                      </SelectItem>
                      <SelectItem
                        className={"text-[1.4rem] text-deep-100"}
                        value={"others"}
                      >
                        {t("placeholders.no")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.gender.message}
                  </span>
                )}
              </div>
              {/* CURRENCY */}
              {/* <div>
                <Select onValueChange={(e) => setValue("currencyId", e)}>
                  <SelectTrigger className="bg-neutral-100 cursor-pointer rounded-[3rem] px-8 border-none w-full py-12 text-[1.4rem] text-neutral-700 leading-[20px]">
                    <SelectValue placeholder={t("placeholders.currency")} />
                  </SelectTrigger>
                  <SelectContent className={"bg-neutral-100 text-[1.4rem]"}>
                    <SelectGroup>
                      {currencies?.map((currency) => {
                        return (
                          <SelectItem
                            key={currency.currencyId}
                            className={"text-[1.4rem] text-deep-100"}
                            value={currency.currencyId}
                          >
                            {currency.isoCode} - {currency.currencyName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.currencyId && (
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.currencyId.message}
                  </span>
                )}
              </div> */}
            </div>
            <div className="w-full hidden lg:block">
              <ButtonPrimary
                disabled={isSubmitting}
                type={"submit"}
                className={
                  "w-full disabled:opacity-50 disabled:cursor-not-allowed "
                }
              >
                {isSubmitting ? <LoadingCircleSmall /> : t("cta")}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <ButtonPrimary
          disabled={isSubmitting}
          type={"submit"}
          className={
            "w-full lg:hidden disabled:opacity-50 disabled:cursor-not-allowed "
          }
        >
          {isSubmitting ? <LoadingCircleSmall /> : t("cta")}
        </ButtonPrimary>
        <div
          className={
            "flex items-center self-center  gap-[1.8rem] border border-neutral-100 p-6 rounded-[10rem] mb-8"
          }
        >
          <p
            className={
              "text-[2.2rem] font-normal leading-[3rem] text-center text-neutral-700"
            }
          >
            <span className={"text-primary-500"}>2</span>/2
          </p>
        </div>
      </div>
    </form>
  );
}
