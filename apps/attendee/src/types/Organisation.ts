import { DateTime } from "luxon"
import Event from "./Event"
import User from "./User"

export default interface Organisation {
    organisationId: string
    userId: string
    organisationName: string
    organisationDescription: string
    organisationEmail : string
    organisationWebsite : string
    country: string
    state: string
    city: string
    profileImageUrl: string | null
    socialLinks: Record<string, any> | null
    currencyId: string
    bankName: string | null
    bankAccountName: string | null
    bankAccountNumber: string | null
    organisationPhoneNumber : string
    balance: number
    withdrawalPin: string | null
    isVerified: boolean
    isPublished: boolean
    membershipTierId: string
    events : Event[]
    followers : User[]
    createdAt: DateTime
    updatedAt: DateTime
}