import { DateTime } from "luxon"

export default interface OrganisationMember {
    userId : string
    firstName : string
    lastName : string
    email : string
    isActive : boolean
    role : string
    addedBy : string
    joinedAt : DateTime
    lastLogin : DateTime
}