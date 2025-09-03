import { DateTime } from 'luxon'
export default interface UserPreference {
    userPreferenceId: string
    userId: string
    appLanguage: string
    upcomingEvents: boolean
    newEventsPreferredCategories: boolean
    newEventsFollowedOrganizer: boolean
    createdAt: DateTime
    updatedAt: DateTime
}