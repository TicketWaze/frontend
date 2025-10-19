import React from "react";
import Event from "@/types/Event";
import { Google } from "iconsax-react";

export default function AddToCalendar({ event }: { event: Event }) {
  const startDateTime = event.eventDays[0].startDate;
  const endDateTime = event.eventDays[0].endTime;

  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatGoogleCalendarDate = (dateString: string) => {
    return dateString.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const formattedStart = formatGoogleCalendarDate(startDateTime);
  const formattedEnd = formatGoogleCalendarDate(endDateTime);

  const addLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.eventName)}&dates=${formattedStart}/${formattedEnd}&details=${encodeURIComponent(event.eventDescription)}&location=${encodeURIComponent(event.address)}`;

  return (
    <a
      href={addLink}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
      }
    >
      <Google size="20" color="#E45B00" variant="Bulk" />
    </a>
  );
}
