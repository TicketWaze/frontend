import { DateTime } from "luxon"

export default interface DiscountCode {
    discountCodeId: string
    code: string
    eventId: string
    type: 'fixed' | 'percentage'
    value: number
    expiresAt: Date
    usageLimit: number
    usageCount: number
    isActive: boolean
    createdAt: DateTime
    updatedAt: DateTime
}