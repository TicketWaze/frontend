import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import CreateOnlineEventForm from "./CreateOnlineEventForm";

export default async function InPersonPage() {
  return (
    <OrganizerLayout title="">
      <CreateOnlineEventForm />
    </OrganizerLayout>
  );
}
