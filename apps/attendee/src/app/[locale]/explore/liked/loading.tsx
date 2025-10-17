import AttendeeLayout from "@/components/Layouts/AttendeeLayout";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import React from "react";

export default function Loading() {
  return (
    <AttendeeLayout
      title=""
      className="h-full flex items-center justify-center"
    >
      <LoadingCircleSmall />
    </AttendeeLayout>
  );
}
