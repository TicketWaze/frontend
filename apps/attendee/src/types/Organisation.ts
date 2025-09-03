import { DateTime } from "luxon"

export default interface Organisation {
    organisationId: string
    userId: string
    organisationName: string
    organisationDescription: string
    country: string
    state: string
    city: string
    profileImageUrl: string | null
    socialLinks: Record<string, any> | null
    currencyId: string
    bankName: string | null
    bankAccountName: string | null
    bankAccountNumber: string | null
    balance: number
    withdrawalPin: string | null
    isVerified: boolean
    isPublished: boolean
    membershipTierId: string
    createdAt: DateTime
    updatedAt: DateTime
}