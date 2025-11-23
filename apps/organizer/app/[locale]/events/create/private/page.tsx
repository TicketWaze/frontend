import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import CreatePrivateEventForm from "./CreatePrivateEventForm";

export default async function PrivatePage() {
  const tagRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
  const tagResponse = await tagRequest.json();
  return (
    <OrganizerLayout title="Private event">
      <CreatePrivateEventForm tags={tagResponse.tags} />
    </OrganizerLayout>
  );
}
