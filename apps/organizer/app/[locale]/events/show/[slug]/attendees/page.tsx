import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import AttendeesPageContent from "./AttendeesPageContent";
import { Event } from "@workspace/typescript-config";
import BackButton from "@workspace/ui/components/BackButton";
import { getTranslations } from "next-intl/server";

export default async function Attendees({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventRequest = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`
  );
  const eventResponse = await eventRequest.json();
  const event: Event = eventResponse.event;
  const t = await getTranslations("Events.single_event.attendees");
  return (
    <OrganizerLayout title="">
      <BackButton text={t("back")} />
      <AttendeesPageContent event={event} />
    </OrganizerLayout>
  );
}
