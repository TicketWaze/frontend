import { DateTime } from "luxon"

export default interface EventDay {
    eventDayId: string
    eventId: string
    organisationId: string
    dayNumber: number
    startDate: string
    startTime: string
    endTime: string
    createdAt: DateTime
    updatedAt: DateTime
}