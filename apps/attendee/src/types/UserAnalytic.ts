import { DateTime } from "luxon"

export default interface UserAnalytic {
    userAnalyticId: string
    userId: string
    eventAttended: number
    eventMissed: number
    ticketPurchased: number
    createdAt: DateTime
    updatedAt: DateTime
}