import { DateTime } from "luxon"

export default interface Ticket {
    ticketId: string
    ticketName: string
    ticketType: string
    eventId: string
    orderId: string
    userId: string
    fullName : string
    ticketPrice: number
    organisationId: string
    status: 'PENDING' | 'CHECKED'
    createdAt: DateTime
    updatedAt: DateTime
}