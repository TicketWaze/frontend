"use client";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import {
  Select as UISelect,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@workspace/ui/components/select";
import { AddCircle, ArrowLeft2, Trash } from "iconsax-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTicketTypes } from "@/actions/EventActions";
import { toast } from "sonner";
import { usePathname } from "@/i18n/navigation";
import { Event, EventTicketType } from "@workspace/typescript-config";

export default function TicketClasses({ event }: { event: Event }) {
  const t = useTranslations("Events.single_event");
  const q = useTranslations("Events.create_event");
  const locale = useLocale();
  const { data: session } = useSession();
  const pathname = usePathname();

  const ticketTypeSchema = z.object({
    ticketTypes: z.array(
      z.object({
        ticketTypeName: z.string().min(1, q("errors.ticketClass.name")),
        ticketTypeDescription: z
          .string()
          .min(20, q("errors.ticketClass.description"))
          .max(100),
        ticketTypePrice: z.string().min(1, q("errors.ticketClass.price")),
        ticketTypeQuantity: z
          .string()
          .min(1, q("errors.ticketClass.quantity.empty"))
          .refine((val) => /^[1-9]\d*$/.test(val), {
            message: q("errors.ticketClass.quantity.decimal"),
          }),
      })
    ),
  });
  type TTicketTypeSchema = z.infer<typeof ticketTypeSchema>;

  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<TTicketTypeSchema>({
    resolver: zodResolver(ticketTypeSchema),
  });

  const [ticketClasses, setTicketClasses] = useState<EventTicketType[]>(
    event.eventTicketTypes
  );

  const classOptions = [
    { label: "General", value: "general" },
    { label: "VIP", value: "vip" },
    { label: "Premium VIP", value: "vvip" },
  ];

  const getAvailableClassOptions = (index: number) => {
    const selectedNames = ticketClasses
      .map((c, i) => (i !== index ? c.ticketTypeName : null))
      .filter(Boolean);

    return classOptions.filter(
      (option) => !selectedNames.includes(option.value)
    );
  };

  async function submitHandler(data: TTicketTypeSchema) {
    const result = await UpdateTicketTypes(
      session?.activeOrganisation.organisationId ?? "",
      event.eventId,
      session?.user.accessToken ?? "",
      { ...data, currencyId: session?.activeOrganisation.currencyId },
      pathname,
      locale
    );
    if (result.status === "success") {
      toast.success("success");
    }
    if (result.error) {
      toast.error(result.error);
    }
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ButtonPrimary className="px-[15px] py-[7.5px]">
          {t("create_ticket")}
        </ButtonPrimary>
      </DrawerTrigger>
      <DrawerContent className="lg:w-full h-[90vh] bg-white px-4 lg:px-28 flex flex-col gap-8">
        <DrawerTitle className="sr-only">{t("create_ticket")}</DrawerTitle>
        <div className="flex items-center justify-between pt-8">
          <div className="flex gap-4 items-center">
            <DrawerClose>
              <div
                className={
                  "w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-100 flex items-center justify-center"
                }
              >
                <ArrowLeft2 size="20" color="#0d0d0d" variant="Bulk" />
              </div>
            </DrawerClose>
            <span className=" font-primary font-medium text-[2.6rem] leading-[30px] text-black">
              {t("ticket")}
            </span>
          </div>
          <ButtonPrimary
            onClick={handleSubmit(submitHandler)}
            className="hidden lg:flex"
          >
            {q("proceed")}
          </ButtonPrimary>
          <div className="lg:hidden absolute bottom-4 left-0 right-0 w-full flex items-center justify-center px-4">
            <ButtonPrimary
              onClick={handleSubmit(submitHandler)}
              className="w-full"
            >
              {q("proceed")}
            </ButtonPrimary>
          </div>
        </div>
        <div className=" overflow-y-scroll flex flex-col gap-8 overflow-x-hidden">
          {ticketClasses.map((t, index) => {
            return (
              <div
                key={index}
                className="max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100"
              >
                <div className={"flex items-center justify-between"}>
                  <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
                    {q("ticket_class")}
                  </span>
                  {index > 0 && (
                    <Trash
                      variant={"Bulk"}
                      color={"#DE0028"}
                      className={"cursor-pointer"}
                      onClick={() => {
                        const updated = ticketClasses.filter(
                          (_, i) => i !== index
                        );
                        setTicketClasses(updated);
                        setValue(
                          "ticketTypes",
                          updated.map((tc) => ({
                            ticketTypeName: tc.ticketTypeName,
                            ticketTypeDescription: tc.ticketTypeDescription,
                            ticketTypePrice: String(tc.ticketTypePrice),
                            ticketTypeQuantity: String(tc.ticketTypeQuantity),
                          })),
                          { shouldValidate: true }
                        );
                      }}
                      size={20}
                    />
                  )}
                </div>
                <Controller
                  control={control}
                  name={`ticketTypes.${index}.ticketTypeName`}
                  defaultValue={t.ticketTypeName}
                  render={({ field }) => (
                    <UISelect
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-neutral-100 w-full rounded-[5rem] p-12 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500 z">
                        <SelectValue placeholder={q("class_name")} />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableClassOptions(index).map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-[1.5rem] leading-[20px] border-b border-neutral-100 mb-3 pb-3"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UISelect>
                  )}
                />
                <div className="">
                  <textarea
                    className={
                      "h-[150px] resize-none bg-neutral-100 w-full rounded-[2rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 "
                    }
                    placeholder={q("class_description")}
                    {...register(`ticketTypes.${index}.ticketTypeDescription`)}
                    // onChange={handleTicketClassWordCount}
                    defaultValue={t.ticketTypeDescription}
                    maxLength={100}
                    minLength={20}
                  />
                  <div className="flex items-center justify-between">
                    <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                      {errors &&
                        errors.ticketTypes?.[index]?.ticketTypeDescription
                          ?.message}
                    </span>
                    {/* {ticketClassDescriptionWordCount > 0 && <span className={`text-[1.2rem] self-end px-8 py-2 ${ticketClassDescriptionWordCount < 20 ? 'text-failure' : 'text-success'}`}>{ticketClassDescriptionWordCount} / 100</span>} */}
                  </div>
                </div>
                <div className={"flex flex-col lg:flex-row gap-4"}>
                  <div className="flex-1">
                    <div
                      className={
                        "flex-1 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 flex gap-2"
                      }
                    >
                      <input
                        className={"outline-none"}
                        type="number"
                        placeholder={`${q("price")}`}
                        defaultValue={t.ticketTypePrice}
                        {...register(`ticketTypes.${index}.ticketTypePrice`)}
                      />
                      <span>{event.eventTicketTypes[0]?.currency}</span>
                    </div>
                    <span
                      className={
                        "text-[1.2rem] lg:hidden px-8 py-2 text-failure"
                      }
                    >
                      {errors.ticketTypes?.[index]?.ticketTypePrice?.message}
                    </span>
                  </div>

                  <div className="flex-1">
                    <input
                      className={
                        "flex-1 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500"
                      }
                      type="number"
                      step={"1"}
                      placeholder={q("quantity")}
                      defaultValue={t.ticketTypeQuantity}
                      {...register(`ticketTypes.${index}.ticketTypeQuantity`)}
                    />
                    <span
                      className={
                        "text-[1.2rem] lg:hidden px-8 py-2 text-failure"
                      }
                    >
                      {errors.ticketTypes?.[index]?.ticketTypeQuantity?.message}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={
                      "text-[1.2rem] flex-1 hidden lg:block px-8 py-2 text-failure"
                    }
                  >
                    {errors.ticketTypes?.[index]?.ticketTypePrice?.message}
                  </span>
                  <span
                    className={
                      "text-[1.2rem] flex-1 hidden lg:block px-8 py-2 text-failure"
                    }
                  >
                    {errors.ticketTypes?.[index]?.ticketTypeQuantity?.message}
                  </span>
                </div>
              </div>
            );
          })}
          {ticketClasses.length < 3 && (
            <div className="w-full max-w-[540px] mx-auto flex justify-between ">
              <div></div>
              <button
                onClick={() =>
                  setTicketClasses((prev) => [
                    ...prev,
                    {
                      ticketTypeName: "",
                      ticketTypeDescription: "",
                      ticketTypePrice: 0,
                      ticketTypeQuantity: 0,
                      eventId: event.eventId,
                      eventTicketTypeId: "",
                      organisationId: "",
                      currency: event.eventTicketTypes[0]?.currency!,
                      usdPrice: 0,
                      isRefundable: event.eventTicketTypes[0]?.isRefundable!,
                      ticketTypeQuantitySold: 0,
                    },
                  ])
                }
                className=" cursor-pointer flex gap-4 items-center"
              >
                <AddCircle color={"#E45B00"} variant={"Bulk"} size={"20"} />
                <span className="text-[1.5rem] leading-8 text-primary-500">
                  {q("add_class")}
                </span>
              </button>
            </div>
          )}
          <div></div>
          <div className="lg:hidden"></div>
          <div className="lg:hidden"></div>
          <div className="lg:hidden"></div>
          <div className="lg:hidden"></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
