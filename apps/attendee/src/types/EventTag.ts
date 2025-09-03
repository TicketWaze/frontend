import { DateTime } from "luxon"

export default interface EventTag {
    tagId: string
    tagName: string
    tagDescription: string
    createdAt: DateTime
    updatedAt: DateTime
}