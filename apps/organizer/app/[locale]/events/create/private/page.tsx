import OrganizerLayout from "@/components/Layouts/OrganizerLayout";
import React from "react";
import CreatePrivateEventForm from "./CreatePrivateEventForm";

export default async function PrivatePage() {
  return (
    <OrganizerLayout title="Private event">
      <CreatePrivateEventForm />
    </OrganizerLayout>
  );
}
