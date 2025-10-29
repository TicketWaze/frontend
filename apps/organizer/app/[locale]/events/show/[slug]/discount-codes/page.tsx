import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import BackButton from "@workspace/ui/components/BackButton";
import { getTranslations } from "next-intl/server";
import React from "react";
import DiscountPageContent from "./DiscountPageContent";
import { Event } from "@workspace/typescript-config";

export default async function DiscountCode({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations("Events.single_event.discount");
  const { slug } = await params;
  const eventRequest = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`
  );
  const eventResponse = await eventRequest.json();
  const event: Event = eventResponse.event;
  return (
    <OrganizerLayout title="Discount codes">
      <BackButton text={t("back")} />
      <DiscountPageContent event={event} />
    </OrganizerLayout>
  );
}
