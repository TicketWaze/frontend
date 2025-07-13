import { DateTime } from "luxon"

export default interface NotificationPreference {
    organisationPreferenceId: string
    organisationId: string
    emailTicketSalesUpdate: boolean
    emailPaymentUpdates: boolean
    emailPlatformAnnouncements: boolean
    createdAt: DateTime
    updatedAt: DateTime
}