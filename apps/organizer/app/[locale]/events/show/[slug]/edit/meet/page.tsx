import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import UpdateOnlineEventForm from "./UpdateOnlineEventForm";
import { getTranslations } from "next-intl/server";
import { Event, EventPerformer } from "@workspace/typescript-config";

export default async function EditEvent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("Events.single_event");
  const eventRequest = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`
  );
  const eventResponse = await eventRequest.json();
  const event: Event = eventResponse.event;
  const tickets = eventResponse.tickets;
  const orders = eventResponse.orders;
  const eventPerformers: EventPerformer[] = event.eventPerformers;
  return (
    <OrganizerLayout title="Edit Event">
      <UpdateOnlineEventForm event={event} />
    </OrganizerLayout>
  );
}
