// forms/CreateInPersonEvent.schema.ts
import * as z from "zod";
import type { TranslateFn } from "./types";

/**
 * Schema factory function.
 * - Accepts `isFree` so ticket price requirement can change.
 * - Accepts `t` translation function (same style as useTranslations).
 */
export function makeCreateInPersonSchema(isFree: boolean, t: TranslateFn) {
  return z.object({
    eventName: z
      .string()
      .min(10, t("errors.basicDetails.name"))
      .max(50)
      .regex(/^[a-zA-Z0-9 ]+$/, {
        message: t("errors.basicDetails.no_special"),
      }),
    eventDescription: z
      .string()
      .min(150, t("errors.basicDetails.description.min"))
      .max(350, t("errors.basicDetails.description.max")),
    address: z.string().min(1, t("errors.basicDetails.address")),
    state: z.string().min(1, t("errors.basicDetails.state")),
    city: z.string().min(1, t("errors.basicDetails.city")),
    country: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? t("errors.basicDetails.country")
            : t("errors.basicDetails.country"),
      })
      .min(1, t("errors.basicDetails.country")),
    longitude: z.string().min(3, t("errors.basicDetails.longitude")),
    latitude: z.string(),
    eventTags: z
      .array(z.object({ tagId: z.string(), tagName: z.string() }), {
        error: (issue) =>
          issue.input === undefined
            ? t("errors.basicDetails.tags")
            : t("errors.basicDetails.tags"),
      })
      .min(1, t("errors.basicDetails.tags")),
    eventImage: z
      .file({
        error: (issue) =>
          issue.input === undefined
            ? t("errors.basicDetails.image.required")
            : t("errors.basicDetails.image.required"),
      })
      .max(504800, t("errors.basicDetails.image.max"))
      .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
    eventDays: z.array(
      z.object({
        // startDate: z
        //   .string()
        //   .min(1, t("errors.dateAndTime.startDate"))
        //   .transform((val) => new Date(val).toISOString()),
        startTime: z
          .string()
          .min(1, t("errors.dateAndTime.startTime"))
          .transform((val) => new Date(val).toISOString()),
        endTime: z
          .string()
          .min(1, t("errors.dateAndTime.endTime"))
          .transform((val) => new Date(val).toISOString()),
      })
    ),
    ticketTypes: z.array(
      z.object({
        ticketTypeName: z.string().min(1, t("errors.ticketClass.name")),
        ticketTypeDescription: z
          .string()
          .min(20, t("errors.ticketClass.description"))
          .max(150),
        ticketTypePrice: isFree
          ? z.string()
          : z.string().min(1, t("errors.ticketClass.price")),
        ticketTypeQuantity: z
          .string()
          .min(1, t("errors.ticketClass.quantity.empty"))
          .refine((val) => /^[1-9]\d*$/.test(val), {
            message: t("errors.ticketClass.quantity.decimal"),
          }),
      })
    ),
    eventCurrency: z.string(),
  });
}
