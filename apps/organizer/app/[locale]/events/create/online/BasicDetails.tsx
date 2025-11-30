"use client";
import React, { useState } from "react";
import { Controller, UseFormRegister, Control } from "react-hook-form";
import Select from "react-select";
import { Input } from "@workspace/ui/components/Inputs";
import type { CreateInPersonFormValues, EventTag } from "./types";
import { useTranslations } from "next-intl";

type Props = {
  register: UseFormRegister<CreateInPersonFormValues>;
  control: Control<CreateInPersonFormValues>;
  errors: any;
  organisationCountry?: string;
  imagePreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tags: EventTag[];
};

export default function BasicDetails({
  register,
  control,
  errors,
  organisationCountry,
  imagePreview,
  handleFileChange,
  tags,
}: Props) {
  const t = useTranslations("Events.create_event");
  const [wordCount, setWordCount] = useState(0);
  function handleWordCount(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setWordCount(e.target.value.length);
  }
  return (
    <div className="flex flex-col gap-12">
      {/* Event details */}
      <div className="p-[15px] max-w-[540px] w-full mx-auto rounded-[15px] flex flex-col gap-[15px] border border-neutral-100">
        <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
          {t("event_details")}
        </span>
        <Input
          {...register("eventName")}
          type="text"
          maxLength={50}
          error={errors.eventName?.message}
        >
          {t("event_name")}
        </Input>
        <div>
          <textarea
            {...register("eventDescription")}
            className={
              "bg-neutral-100 w-full rounded-[2rem] h-[150px] resize-none p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500"
            }
            placeholder={t("description")}
            minLength={150}
            maxLength={350}
            onChange={handleWordCount}
          />
          <div className="flex items-center justify-between">
            <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
              {errors.eventDescription?.message}
            </span>
            {wordCount > 0 && (
              <span
                className={`text-[1.2rem] text-nowrap px-8 py-2 ${wordCount < 150 ? "text-failure" : "text-success"}`}
              >
                {wordCount} / 350
              </span>
            )}
          </div>
        </div>
      </div>

      {/* tags */}
      <div className="max-w-[540px]  w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100">
        <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
          {t("event_tags")}
        </span>
        <div>
          <Controller
            control={control}
            name="eventTags"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={tags}
                placeholder={t("event_tags")}
                styles={{
                  control: () => ({
                    borderColor: "transparent",
                    display: "flex",
                  }),
                }}
                getOptionLabel={(option) => option.tagName}
                getOptionValue={(option) => option.tagId}
                className="bg-neutral-100 w-full rounded-[5rem] p-4 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500"
              />
            )}
          />
          <span className="text-[1.2rem] px-8 py-2 text-failure">
            {errors.eventTags?.message}
          </span>
        </div>
      </div>

      {/* image */}
      <div className="max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100">
        <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
          {t("thumbnail")}
        </span>

        {imagePreview ? (
          <div className="relative w-full h-[300px]">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-[300px] object-cover object-top rounded-[1rem]"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <div className="py-[6rem] px-[1.4rem] rounded-[7px] border border-[#e5e5e5] border-dashed bg-[#FBFBFB] flex items-center justify-center relative">
            <div className="flex flex-col items-center gap-4 ">
              <p className="text-[1.5rem] leading-[20px] text-neutral-500 ">
                {t("thumbnail_text")}{" "}
                <span className="font-medium text-primary-500">
                  {t("browse")}
                </span>
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        <span className="text-[1.2rem] px-8 py-2 text-failure">
          {errors.eventImage?.message}
        </span>
      </div>

      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
