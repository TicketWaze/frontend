import { DateTime } from "luxon"
import EventDay from "./EventDay"
import EventTicketType from "./EventTicketType"
import EventTag from "./EventTag"
import DiscountCode from "./DiscountCode"

export default interface Event {
    eventId: string
    organisationId: string
    eventName: string
    eventDescription: string
    address: string
    state: string
    city: string
    country: string
    eventImageUrl: string
    eventType: string
    isPublished: boolean
    isActive: boolean
    eventDays : EventDay[]
    eventTicketTypes : EventTicketType[]
    eventTags : EventTag[]
    discountCodes : DiscountCode[]
    createdAt: DateTime
    updatedAt: DateTime    
}