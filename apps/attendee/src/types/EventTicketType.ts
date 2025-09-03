import { DateTime } from "luxon"

export default interface EventTicketType {
    eventTicketTypeId: string
    eventId: string
    organisationId: string
    ticketTypeName: string
    ticketTypeDescription: string
    ticketTypePrice: number
    currencyId: string
    ticketTypeQuantity: number
    createdAt?: DateTime
    updatedAt?: DateTime
}