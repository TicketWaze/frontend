import { DateTime } from "luxon"

export default interface WaitlistMember {
    organisationId: string
    fullName: string
    email: string
    role: number
    dateAdded: DateTime
    addedBy: string
    createdAt: DateTime
    updatedAt: DateTime
}