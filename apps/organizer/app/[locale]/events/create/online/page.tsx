import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import CreateOnlineEventForm from "./CreateOnlineEventForm";

export default async function InPersonPage() {
  const tagRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
  const tagResponse = await tagRequest.json();
  return (
    <OrganizerLayout title="">
      <CreateOnlineEventForm tags={tagResponse.tags} />
    </OrganizerLayout>
  );
}
