import React from 'react'
import Event from '@/types/Event';
import { Google } from 'iconsax-react';

export default function AddToCalendar({ event }: { event: Event }) {
    const formatDateTime = (date: string, time: string) => {
        // Extract just YYYY-MM-DD from the date string
        const dateOnly = date.split('T')[0];
        const [year, month, day] = dateOnly.split('-');
        const [hours, minutes] = time.split(':');

        // Create a date object in local timezone
        const localDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day) - 1,
            parseInt(hours),
            parseInt(minutes),
            0
        );

        // Convert to UTC
        const utcYear = localDate.getUTCFullYear();
        const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
        const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

        return `${utcYear}${utcMonth}${utcDay}T${utcHours}${utcMinutes}00Z`;
    };

    const startDateTime = formatDateTime(event.eventDays[0].startDate, event.eventDays[0].startTime);
    const endDateTime = formatDateTime(event.eventDays[0].startDate, event.eventDays[0].endTime);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const addLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.eventName)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(event.eventDescription)}&location=${encodeURIComponent(event.address)}&ctz=${encodeURIComponent(timezone)}`;
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
    )
}