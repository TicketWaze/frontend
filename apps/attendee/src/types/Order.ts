import { DateTime } from "luxon"

export default interface Order {
    orderId: string
    eventId: string
    userId: string
    organisationId: string
    amount: number
    orderName: string
    provider: string
    status: 'PENDING' | 'SUCCESSFUL'
    createdAt: DateTime
    updatedAt: DateTime
}